import * as React from 'react';
import { useForm } from '@mantine/form';
import {
	ActionIcon,
	Button,
	Card,
	Checkbox,
	Flex,
	NumberInput,
	PasswordInput,
	Select,
	Textarea,
	TextInput,
	Title,
	type ButtonProps,
	MultiSelect, 
	Fieldset
} from '@mantine/core';
import { type IFormField, FieldType, UiType } from '@/backoffice-common/types/form';
import {
	getFormInitialValues,
	getFormValueByKey,
	type IFormValues,
	isFieldRequired,
	isFieldVisible,
	SEPARATOR,
	transformValuesAsync,
	validator,
	formatSelectValue,
	getFormItemPathByKey
} from './helper';
import { randomId } from '@mantine/hooks';
import { CascadingSelect, FetchSelect, FileUpload, FormRTE, MapAddressPicker, Location, SearchableSelect } from './components';
import { combineURL, isUserInputNumber } from '@/backoffice-common/utils';
import { DatePickerInput, TimeInput, DateTimePicker, YearPickerInput } from '@mantine/dates';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { clone, mergeDeepLeft, omit, path } from 'ramda';
import dayjs from 'dayjs';
import classes from './Form.module.scss';
import { useTranslation } from 'react-i18next';
import type { IMapAddressValue } from '@/backoffice-common/components/form/components/map-address-picker/types';
import { useLocation } from 'react-router-dom';

// TODO: code splitting

interface IFormProps {
	fields: IFormField[];
	onSubmit: (values: IFormValues) => void;
	values?: Record<string, any>;
	getReferences?: (code: string, parent?: string) => Promise<any[]>;
	submitButtonProps?: ButtonProps;
	onChange?: (value: IFormValues) => void;
	direction?: React.CSSProperties['flexDirection'];
	getFetchParams?: (currentParams: Record<string, unknown>) => Record<string, unknown>;
}

const Form = ({
	fields,
	onSubmit,
	getReferences,
	values,
	submitButtonProps,
	onChange,
	direction = 'column',
	getFetchParams
}: IFormProps) => {
	const { t } = useTranslation();
	const { pathname } = useLocation();

	const form = useForm<IFormValues>({
		initialValues: getFormInitialValues(fields, values),
		// transformValues,
		validate(values) {
			return validator(fields, values);
		},
		// onValuesChange: onChange
	});

	React.useEffect(() => {
		if (onChange) {
			onChange(form.values)
		}
	}, [form.values])

	// console.log('form initial Values>>>>', getFormInitialValues(fields, values));
	console.log('FORM VALUES>>>>', form.values);

	const handleError = (validationErrors: any, _values: any, _event: any) => {
		console.log('Form Error>>>', { validationErrors, _values: _values, _event: _event });
	};

	const getFormField = (field: IFormField): React.ReactNode => {
		const isVisible = isFieldVisible(field, form.values);

		if (!isVisible) {
			return null;
		}

		switch (field.type) {
			case FieldType.ARRAY: {
				if (field.element) {
					const { key } = field;
					const fieldElement = clone(field.element);
					fieldElement.isArrayElement = true;
					let groupPath = (field.groupPath ? field.groupPath + SEPARATOR : '') + key;
					return (
						<Card
							key={groupPath}
							shadow='xs'
							padding='md'
							radius='md'
							withBorder
							mt='xs'
							className={classes.card}
						>
							<Card.Section
								inheritPadding
								withBorder
								py='xs'
							>
								<Flex
									align='center'
									gap={5}
								>
									<ActionIcon
										color='primary'
										variant='light'
										onClick={() => {
											if (field.element) {
												const initialValue = getFormInitialValues([fieldElement], values);
												form.insertListItem(groupPath, initialValue);
											}
										}}
										size='sm'
										radius='sm'
									>
										<IconPlus size={16} />
									</ActionIcon>
									<Title
										order={6}
										style={{ fontWeight: 600 }}
									>
										{field.label}
									</Title>
								</Flex>
							</Card.Section>
							<Card.Section
								inheritPadding
								py='md'
							>
								{(path(getFormItemPathByKey(groupPath), form.values) as any[]).map((formItem: unknown, index: number, array: any[]) => {
									const elementPath = groupPath + SEPARATOR + index;
									fieldElement.groupPath = elementPath;
									return (
										<Card
											key={elementPath}
											shadow='xs'
											padding='md'
											radius='md'
											mt='xs'
											withBorder
											className={classes.card}
										>
											{array.length > 1 && (
												<Card.Section
													inheritPadding
													withBorder
													py='xs'
												>
													<Flex
														justify='flex-end'
													>
														<ActionIcon
															color='red'
															variant='outline'
															onClick={() => {
																form.removeListItem(groupPath, index);
															}}
															size='sm'
															radius='sm'
														>
															<IconMinus size={16} />
														</ActionIcon>
													</Flex>
												</Card.Section>
											)}
											<Card.Section
												inheritPadding
												py='md'
											>
												{getFormField(fieldElement)}
											</Card.Section>
										</Card>
									);
								})}
							</Card.Section>
						</Card>
					);
				}
				return null;
			}
			case FieldType.OBJECT: {
				const { key } = field;
				let groupPath = field.groupPath ?? '';
				if (!field.isArrayElement) {
					groupPath = (field.groupPath ? field.groupPath + SEPARATOR : '') + key;
				}
				const fieldClone = (field.fields ?? []).map(f => {
					const child = clone(f);
					child.groupPath = groupPath;
					return child;
				});

				return (
					<Fieldset key={groupPath} legend={field.label} >
						{fieldClone.map(getFormField)}
					</Fieldset>
				)
			}
			case FieldType.GROUP: {
				let groupPath = field.groupPath ?? '';
				const clonedField = (field.fields ?? []).map(f => {
					const child = clone(f);
					child.groupPath = groupPath;
					return child;
				});
				return (
					<Card
						key={groupPath}
						shadow='xs'
						padding='md'
						radius='md'
						withBorder
						mt='xs'
						className={classes.card}
					>
						<Card.Section
							inheritPadding
							py='md'
						>
							{clonedField.map(getFormField)}
						</Card.Section>
					</Card>
				);
			}
			case FieldType.RENDER: {
				return null;
			}
		}

		const valueKey = (field.groupPath ? field.groupPath + SEPARATOR : '') + field.key;

		const props: any = {
			key: valueKey,
			label: field.label ?? '-',
			size: direction === 'row' ? 'xs' : 'sm',
			autoComplete: 'off',
			withAsterisk: isFieldRequired(field, fields, form.values),
			...form.getInputProps(valueKey, {
				type: field.uiType === UiType.CHECKBOX ? 'checkbox' : 'input',
			}),
		};
		switch (field.uiType) {
			case UiType.TEXT_INPUT: {
				if (field.secret) {
					return (
						<PasswordInput
							{...props}
							autoComplete={'new-password'}
						/>
					);
				}
				if (field.multiLine) {
					return (
						<Textarea
							{...props}
							autosize
							minRows={2}
							autoComplete={'off'}
						/>
					);
				}
				if (field.number) {
					return (
						<NumberInput
							{...props}
							autoComplete='off'
							precision={10}
						/>
					);
				}
				return (
					<TextInput
						{...props}
						autoComplete='off'
						onChange={event => {
							if (field.numeric) {
								isUserInputNumber(event.currentTarget.value) && props.onChange(event);
							} else {
								props.onChange(event);
							}
						}}
					/>
				);
			}
			case UiType.SELECT: {
				if ('optionsApi' in field) {
					// if (field.optionsApi?.uri) {
					const params: Record<string, unknown> = {};

					for (const queryParamKey of field.optionsApi.queryParams ?? []) {
						params[queryParamKey] = getFormValueByKey(queryParamKey, form.values);
					}

					if (field.optionsApi.queryParams?.includes('parentId')) {
						// back-end tei yariad iim shiideld hurev
						params.parentId = pathname.split('/')?.[2] ?? '';
					}

					const uri = combineURL(
						field.optionsApi?.uri,
						getFetchParams ? mergeDeepLeft(params, getFetchParams(params)) : params
					);
					return (
						<FetchSelect
							{...props}
							uri={uri}
							multiple={field.multiple}
						/>
					);
				}
				if ('refCode' in field) {
					return (
						<FetchSelect
							{...props}
							refCode={field.refCode}
							fetchReference={getReferences}
							multiple={field.multiple}
						/>
					);
				}
				if (field.options) {
					if (field.multiple) {
						return (
							<MultiSelect
								clearable
								{...props}
								value={props.value ?? []}
								data={formatSelectValue(field.options)}
							/>
						);
					}
					return (
						<Select
							clearable
							{...props}
							data={formatSelectValue(field.options)}
						/>
					);
				}
				return null;
			}
			case UiType.CASCADING_SELECT: {
				return (
					<CascadingSelect
						key={valueKey}
						fetchReference={getReferences}
						refCode={field.refCode ?? ''}
						onChange={value => form.setFieldValue(valueKey, value)}
						error={form.errors[valueKey]}
					/>
				);
			}
			case UiType.TIME: {
				return (
					<TimeInput
						{...props}
						withSeconds={field.format !== 'HH:mm'}
					/>
				);
			}
			case UiType.DATE: {
				const format = field.format ?? 'YYYY/MM/DD';
				const value = props.value ? new Date(props.value) : null;
				const startDate = field.startDate ? dayjs(field.startDate) : undefined;
				const endDate = field.endDate ? dayjs(field.endDate) : undefined;
				return (
					<DatePickerInput
						{...props}
						valueFormat={format}
						onChange={(value: Date) => {
							const v = value ? dayjs(value).format(format) : undefined;
							props?.onChange?.(v);
						}}
						value={value}
						excludeDate={(date) => {
							if (endDate && dayjs(date).isAfter(endDate, 'day')) {
								return true;
							}
							if (startDate && dayjs(date).isBefore(startDate, 'day')) {
								return true;
							}
							return false;
						}}
						clearable
					/>
				);
			}
			case UiType.DATETIME: {
				const format = field.format ?? 'YYYY/MM/DD HH:mm';
				const value = props.value ? new Date(props.value) : null;
				return (
					<DateTimePicker
						{...props}
						valueFormat={format}
						onChange={(value: Date) => {
							const v = value ? dayjs(value).format(format) : undefined;
							props?.onChange?.(v);
						}}
						value={value}
						clearable
					/>
				);
			}
			case UiType.CHECKBOX: {
				return <Checkbox
					{...omit(['withAsterisk'], props)}
					label={(
						<div className={classes.checkboxLabel}>
							{props.label}
						</div>
					)}
				/>;
			}
			case UiType.MAP_ADDRESS_PICKER: {
				return (
					<MapAddressPicker
						key={valueKey}
						field={field}
						onChange={value => form.setFieldValue(valueKey, value)}
						value={getFormValueByKey(valueKey, form.values) as IMapAddressValue | undefined}
					/>
				);
			}
			case UiType.FILE_UPLOAD: {
				return (
					<FileUpload
						{...props}
						accept={field.mimeType}
					/>
				);
			}
			case UiType.HTML_INPUT: {
				return (
					<FormRTE
						key={valueKey}
						field={field}
						value={getFormValueByKey(valueKey, form.values) as string | undefined}
						onChange={value => form.setFieldValue(valueKey, value)}
					/>
				);
			}
			case UiType.SEARCH_SELECT: {
				return (
					<SearchableSelect
						{...props}
						uri={field.optionsApi.uri}
						multiple={field.multiple}
					/>
				)
			}
			case UiType.LOCATION: {
				return (
					<Location
						{...props}
						onSave={props.onChange}
					/>
				)
			}
			case UiType.YEAR: {
				return (
					<YearPickerInput
						clearable
						{...props}
					/>
				)
			}
			default: {
				return null;
			}
		}
	};

	const renderFormFields = (): React.ReactNode => {
		const renderFields: React.ReactNode[] = [];
		for (const field of fields) {
			// console.log('field>>>', field);
			// const isVisible = isFieldVisible(field, form.values);
			// const groupKey = getGroupKey(field);
			// console.log('groupKey>>>>', groupKey);
			// console.log('field key>>>>>>', field.key);
			// if (isVisible) {
			renderFields.push(getFormField(field));
			// }
		}
		return renderFields;
	};

	const handleSubmit = async (values: typeof form.values) => {
		const transformed = await transformValuesAsync(fields, values, values);
		onSubmit(transformed ?? {});
	};

	return (
		<div className={direction === 'row' ? undefined : classes.wrapper}>
			<form
				onSubmit={form.onSubmit(handleSubmit, handleError)}
				onReset={form.onReset}
			>
				<Flex direction={direction} gap='xs' wrap={direction === 'row' ? 'wrap' : undefined}>{renderFormFields()}</Flex>
				<Flex
					justify='flex-end'
					align='center'
					wrap='wrap'
				>
					<Button
						type='submit'
						mt={'sm'}
						{...submitButtonProps}
					>
						{t('action.submit', { ns: 'common' })}
					</Button>
				</Flex>
			</form>
		</div>
	);
};

const FormWrapper = (props: IFormProps) => {
	const { key, fields } = React.useMemo(() => {
		return {
			key: randomId(),
			fields: props.fields,
			// fields: refactorFields(props.fields)
		};
	}, [ props.fields, props.values ]);

	return (
		<Form
			key={key}
			{...props}
			fields={fields}
		/>
	);
};

export default FormWrapper;
