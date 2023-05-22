import * as React from 'react';
import axios from 'axios';
import { MultiSelect, SelectItem, Loader, MultiSelectProps } from '@mantine/core';
import type { ISelectOption } from '@/backoffice-common/types/api';
import type { IResponse } from '@/backoffice-common/types/api';
import { IReference } from '@/backoffice-common/types/api';

interface CommonProps {
    multiple?: boolean;
    onChange: (value: string | string[]) => void;
    value: unknown;
}

type IURIFetchSelect = Omit<MultiSelectProps, 'onChange' | 'value'> & {
    uri: string;
    fetchReference: undefined;
    refCode: undefined;
}

type IRefCodeFetchSelect = Omit<MultiSelectProps, 'onChange' | 'value'> & {
    fetchReference?: (code: string, parent?: string) => Promise<any[]>;
    refCode: string;
    uri: undefined;
}

type TruncateProps = IURIFetchSelect | IRefCodeFetchSelect;

type Props = CommonProps & TruncateProps;

const FetchSelect = ({
    uri,
    multiple,
    fetchReference,
    refCode,
    ...props
}: Props) => {

    const isFetchedRef = React.useRef<boolean>(false);
    const [ options, setOptions ] = React.useState<SelectItem[]>([]);
    const [ isLoading, setIsLoading ] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchData = async () => {
            if (uri) {
                if (!isFetchedRef.current) {
                    isFetchedRef.current = true;
                    setIsLoading(true);
                    const { data } = await axios.get<IResponse<ISelectOption[]>>(uri, { silent: true });
                    setOptions(data.data ?? []);
                    setIsLoading(false);
                }
            }
            if (refCode && fetchReference) {
                if (!isFetchedRef.current) {
                    isFetchedRef.current = true;
                    setIsLoading(true);
                    const _data: IReference[] = await fetchReference(refCode ?? '', refCode);
                    const _options = _data.map(item => {
                        return {
                            value: item.code,
                            label: item.name
                        }
                    })
                    setOptions(_options);
                    setIsLoading(false);
                }
            }
        }
        void fetchData();
    }, []);

    const handleChange = (value: string[]) => {
        const v = multiple ? value : value[0];
        props?.onChange?.(v);
    }

    let value: string[] | undefined = [];
    if (multiple) {
        value = props.value as string[] ?? [];
    } else if (props.value) {
        value = [ (props.value as string) ];
    }

    return (
        <MultiSelect
            {...props}
            clearable
            data={options}
            icon={isLoading && <Loader variant='oval' size='xs'/>}
            onChange={handleChange}
            value={value}
        />
    )
};

export default FetchSelect;