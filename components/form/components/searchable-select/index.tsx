import * as React from 'react';
import { Loader, Popover, Chip, Button, Text } from "@mantine/core";
import { useDebouncedValue, useElementSize } from "@mantine/hooks";
import axios from "axios";
import qs from "qs";
import { IconSearch } from "@tabler/icons-react";
import { useStyles } from './styles';
import type { IResponse } from '@/backoffice-common/types/api';

interface DataItem {
    label: string;
    value: string;
}

interface IProps<T> {
    uri: string;
    parser?: (item: T, index: number) => DataItem;
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    label?: string;
    withAsterisk?: boolean;
}

function SearchableSelect<T>({
    uri,
    parser,
    value,
    placeholder,
    onChange,
    label,
    withAsterisk = false
}: IProps<T>){

    const { ref, width } = useElementSize();
    const { classes } = useStyles();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [ searchValue, setSearchValue ] = React.useState('');
    const [ debounced ] = useDebouncedValue(searchValue, 500);
    const [ data, setData ] = React.useState<DataItem[]>([]);
    const [ loading, setLoading ] = React.useState(false);
    const [ selectedValue, setSelectedValue ] = React.useState<DataItem | null>(null);

    const controllerRef = React.useRef(new AbortController());

    React.useEffect(() => {
        if (!value) {
            setSelectedValue(null);
        }
    }, [value])

    React.useEffect(() => {
        try {
            if (debounced) {
                const fetchData = async () => {
                    setLoading(true);
                    const params = {
                        search: debounced,
                    }
                    const queryParams = qs.stringify(params);
                    const { data: responseData } = await axios.get<IResponse<T[]>>(
                        `${uri}?${queryParams}`,
                        {
                            silent: true,
                            signal: controllerRef.current.signal,
                        }
                    );
                    let parsed: DataItem[] = [];
                    if (parser) {
                        parsed = (responseData.data ?? []).map(parser);
                    } else {
                        parsed = (responseData.data ?? []).map((item: any) => {
                            return {
                                value: item.value,
                                label: item.label,
                            }
                        });
                    }

                    setData(parsed);
                    setLoading(false)
                }
                void fetchData();
            }
        } catch (e) {
            setLoading(false)
        }

    }, [debounced]);

    const handleSelect = (item: DataItem) => {
        setSelectedValue(item);
        setSearchValue('');
        setData([]);
        onChange(item.value);
    }

    return (
        <Popover opened={!!data.length} onClose={() => setData([])} width={width} zIndex={1000}>
            <Popover.Target>
                <div>
                    <div className={classes.label}>
                        {
                            label && (
                                <Text fz='sm' fw={500}>
                                    {label}
                                </Text>
                            )
                        }
                        {
                            withAsterisk && (
                                <Text fz='sm' fw={500} c='red'>
                                    &nbsp;*
                                </Text>
                            )
                        }
                    </div>
                    <div className={classes.inputWrapper} onClick={() => inputRef?.current?.focus?.()} ref={ref}>
                        <div className={classes.icon}>
                            {
                                loading ? <Loader size='xs' variant='oval'/> : <IconSearch size={16}/>
                            }
                        </div>
                        {
                            value && selectedValue && !searchValue && (
                                <Chip radius='md' checked={false}>
                                    {selectedValue.label}
                                </Chip>
                            )
                        }
                        <input
                            className={classes.input}
                            ref={inputRef}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.currentTarget.value)}
                            placeholder={placeholder}
                        />
                    </div>
                </div>
            </Popover.Target>

            <Popover.Dropdown className={classes.dropdown}>
                {
                    data.map((item) => {
                        return (
                            <Button
                                key={item.value}
                                variant="subtle"
                                color="gray"
                                onClick={() => handleSelect(item)}
                                fullWidth
                                classNames={{
                                    inner: classes.buttonInner
                                }}
                            >
                                {item.label}
                            </Button>
                        )
                    })
                }
            </Popover.Dropdown>
        </Popover>

    )
}


export default SearchableSelect;
