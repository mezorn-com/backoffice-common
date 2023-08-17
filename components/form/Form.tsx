import * as React from 'react';
import { useForm } from '@mantine/form';
import {
	ActionIcon,
	Button,
	Card,
	Checkbox,
	FileInput,
	Flex,
	NumberInput,
	PasswordInput,
	Select,
	Stack,
	Textarea,
	TextInput,
	Title,
	ButtonProps,
	MultiSelect,
} from '@mantine/core';
import type { IFormField } from '@/backoffice-common/types/form';
import { FieldType, UiType } from '@/backoffice-common/types/form';
import { getFormInitialValues, getFormValueByKey, IFormValues, isFieldRequired, isFieldVisible, SEPARATOR, transformValuesAsync, validator } from './helper';
import { randomId } from '@mantine/hooks';
import { CascadingSelect, FetchSelect, FormRTE, MapAddressPicker } from './components';
import { combineURL, isUserInputNumber } from '@/backoffice-common/utils';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { clone, omit } from 'ramda';
import dayjs from 'dayjs';
import { useFormStyles } from './styles';
import { useTranslation } from 'react-i18next';
import { IMapAddressValue } from '@/backoffice-common/components/form/components/map-address-picker/types';
import { useLocation } from 'react-router-dom';

interface IFormProps {
	fields: IFormField[];
	onSubmit: (values: IFormValues) => void;
	values?: Record<string, any>;
	getReferences?: (code: string, parent?: string) => Promise<any[]>;
	submitButtonProps?: ButtonProps;
	onChange?: (value: IFormValues) => void;
}

const Form = ({ fields, onSubmit, getReferences, values, submitButtonProps, onChange }: IFormProps) => {
	const { t } = useTranslation();
	const { classes } = useFormStyles();
	const { pathname } = useLocation();

	const form = useForm<IFormValues>({
		initialValues: getFormInitialValues(fields, values),
		// transformValues,
		validate(values) {
			return validator(fields, values);
		},
	});

	React.useEffect(() => {
		if (onChange) {
			onChange(form.values);
		}
	}, [form.values]);

	console.log('form initial Values>>>>', getFormInitialValues(fields, values));
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
									>
										<IconPlus />
									</ActionIcon>
									<Title
										order={6}
										weight={600}
									>
										{field.label}
									</Title>
								</Flex>
							</Card.Section>
							<Card.Section
								inheritPadding
								py='md'
							>
								{form.values[key].map((formItem: unknown, index: number, array: any[]) => {
									const elementPath = groupPath + SEPARATOR + index;
									fieldElement.groupPath = elementPath;
									fieldElement.isArrayElement = true;
									return (
										<Card
											key={elementPath}
											shadow='xs'
											padding='md'
											radius='md'
											withBorder
											className={classes.card}
										>
											{array.length > 1 && (
												<Card.Section
													inheritPadding
													withBorder
													py='xs'
												>
													<ActionIcon
														color='red'
														variant='light'
														onClick={() => {
															form.removeListItem(groupPath, index);
														}}
													>
														<IconMinus />
													</ActionIcon>
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
					<Card
						key={groupPath}
						shadow='xs'
						padding='md'
						radius='md'
						withBorder
						mt='xs'
						className={classes.card}
					>
						{field.label && (
							<Card.Section
								inheritPadding
								withBorder
								py='xs'
							>
								<Title
									order={6}
									weight={600}
								>
									{field.label}
								</Title>
							</Card.Section>
						)}
						<Card.Section
							inheritPadding
							py='md'
						>
							{fieldClone.map(getFormField)}
						</Card.Section>
					</Card>
				);
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
			withAsterisk: isFieldRequired(field, form.values),
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
							autoComplete={'off'}
						/>
					);
				}
				if (field.multiLine) {
					return (
						<Textarea
							{...props}
							autosize
							minRows={2}
						/>
					);
				}
				if (field.number) {
					return (
						<NumberInput
							{...props}
							autoComplete='off'
							precision={10}
							removeTrailingZeros
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

					const uri = combineURL(field.optionsApi?.uri, params);
					return (
						<FetchSelect
							{...props}
							uri={uri}
							multiple={field.multiple}
							data={[]}
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
							data={[]}
						/>
					);
				}
				if (field.options) {
					if (field.multiple) {
						return (
							<MultiSelect
								{...props}
								data={field.options}
							/>
						);
					}
					return (
						<Select
							{...props}
							data={field.options}
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
						withSeconds={field.format === 'HH:mm' ? false : true}
					/>
				);
			}
			case UiType.DATE: {
				const format = field.format ?? 'YYYY/MM/DD';
				const value = props.value ? new Date(props.value) : props.value;
				return (
					<DatePickerInput
						{...props}
						valueFormat={format}
						onChange={(value: Date) => {
							const v = dayjs(value).format(format);
							props?.onChange?.(v);
						}}
						value={value}
					/>
				);
			}
			case UiType.CHECKBOX: {
				return <Checkbox {...omit(['withAsterisk'], props)} />;
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
					<FileInput
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
		<div style={{ padding: '1rem' }}>
			{' '}
			{/** TODO: remove temporary inline style **/}
			<form
				onSubmit={form.onSubmit(handleSubmit, handleError)}
				onReset={form.onReset}
			>
				<Flex direction={'column'}>{renderFormFields()}</Flex>
				<Button
					type='submit'
					mt={'sm'}
					{...submitButtonProps}
				>
					{t('action.submit', { ns: 'common' })}
				</Button>
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
	}, [props.fields, props.values]);

	return (
		<Form
			key={key}
			{...props}
			fields={fields}
		/>
	);
};

export default FormWrapper;
