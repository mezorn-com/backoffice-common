import type {
	IReference,
	IResponse,
	ISelectOption,
} from '@/backoffice-common/types/api';
import { type ComboboxItem, Loader, MultiSelect, Select } from '@mantine/core';
import type { GetInputProps } from '@mantine/form/lib/types';
import axios from 'axios';
import * as React from 'react';
import { type SelectValue, getTransformedValue } from './helper';

interface CommonProps {
	multiple?: boolean;
	onChange: (value: SelectValue) => void;
	value: SelectValue;
}

type IURIFetchSelect = Omit<
	ReturnType<GetInputProps<unknown>>,
	'onChange' | 'value'
> & {
	uri: string;
	fetchReference: undefined;
	refCode: undefined;
};

type IRefCodeFetchSelect = Omit<
	// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix type
	ReturnType<GetInputProps<any>>,
	'onChange' | 'value'
> & {
	// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix type
	fetchReference?: (code: string, parent?: string) => Promise<any[]>;
	refCode: string;
	uri: undefined;
};

type TruncateProps = IURIFetchSelect | IRefCodeFetchSelect;

type Props = CommonProps & TruncateProps;

const FetchSelect = ({
	uri,
	multiple = false,
	fetchReference,
	refCode,
	...props
}: Props) => {
	const isFetchedRef = React.useRef<boolean | string>(false);
	const [options, setOptions] = React.useState<ComboboxItem[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		const fetchData = async () => {
			if (uri) {
				if (
					isFetchedRef.current === false ||
					(isFetchedRef.current && isFetchedRef.current !== uri)
				) {
					isFetchedRef.current = uri;
					setIsLoading(true);
					try {
						const { data } = await axios.get<
							IResponse<ISelectOption[]>
						>(uri, {
							silent: true,
						});
						setOptions(data.data ?? []);
					} catch (e) {
						console.log('Fetch Select Error: ', e);
					} finally {
						setIsLoading(false);
					}
				}
			}
			if (refCode && fetchReference) {
				if (!isFetchedRef.current) {
					isFetchedRef.current = true;
					setIsLoading(true);
					const _data: IReference[] = await fetchReference(
						refCode ?? '',
						refCode,
					);
					const _options = _data.map(item => {
						return {
							value: item.code,
							label: item.name,
						};
					});
					setOptions(_options);
					setIsLoading(false);
				}
			}
		};
		void fetchData();
	}, [uri, fetchReference, refCode]);

	const handleChange = (value: SelectValue) => {
		props?.onChange?.(getTransformedValue(value, multiple));
	};

	if (!multiple) {
		const value = getTransformedValue(props.value, multiple) as
			| string
			| null;
		return (
			<Select
				{...props}
				clearable
				data={options}
				leftSection={isLoading && <Loader variant='oval' size='xs' />}
				onChange={handleChange}
				value={value}
				maxDropdownHeight={undefined}
			/>
		);
	}

	const value = getTransformedValue(props.value, multiple) as string[] | null;

	return (
		<MultiSelect
			{...props}
			clearable
			data={options}
			leftSection={isLoading && <Loader variant='oval' size='xs' />}
			onChange={handleChange}
			value={value ?? []}
		/>
	);
};

export default FetchSelect;
