import * as React from 'react';
import { Loader, Popover, Chip, Button, ActionIcon } from "@mantine/core";
import { useDebouncedValue, useElementSize } from "@mantine/hooks";
import axios from "axios";
import qs from "qs";
import { IconSearch, IconX } from "@tabler/icons-react";
import type { IResponse } from '@/backoffice-common/types/api';
import { FormLabel } from '@/backoffice-common/components/form/components';
import { clone } from 'ramda';
import classes from './SearchableSelect.module.scss';

interface Option {
    label: string;
    value: string;
}

interface CommonProps {
    uri: string;
    parser?: (item: any, index: number) => Option;
    placeholder?: string;
    label?: string;
    withAsterisk?: boolean;
}

interface MultiProps extends CommonProps {
    multiple: true;
    value: (string | Option)[];
    onChange: (value: string[] | null) => void;
}

interface SingleProps extends CommonProps {
    multiple?: false;
    value: string | Option;
    onChange: (value: string | null) => void;
}

type Props = MultiProps | SingleProps;

const isValueOption = (value: string | Option): value is Option => {
    return typeof value !== 'string';
}

const SearchableSelect = ({
    uri,
    parser,
    placeholder,
    label,
    withAsterisk = false,
    ...props
}: Props) => {

    const { ref, width } = useElementSize();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [ searchValue, setSearchValue ] = React.useState('');
    const [ debounced ] = useDebouncedValue(searchValue, 500);
    const [ data, setData ] = React.useState<Option[]>([]);
    const [ loading, setLoading ] = React.useState(false);
    const [ selectedValue, setSelectedValue ] = React.useState<null | Option[]>(null);

    const controllerRef = React.useRef(new AbortController());

    React.useEffect(() => {
        if (!props.value) {
            setSelectedValue(null);
        } else if (!selectedValue) {
            if (props.multiple) {
                const value = props.value.filter(isValueOption);
                setSelectedValue(value);
                props.onChange(value.map(item => item.value));
            } else {
                if (isValueOption(props.value)) {
                    setSelectedValue([props.value]);
                    props.onChange(props.value.value);
                }
            }
        }
    }, [props.value]);

    React.useEffect(() => {
        try {
            if (debounced) {
                const fetchData = async () => {
                    setLoading(true);
                    const params = {
                        search: debounced,
                    }
                    const queryParams = qs.stringify(params);
                    const { data: responseData } = await axios.get<IResponse<unknown[]>>(
                        `${uri}?${queryParams}`,
                        {
                            silent: true,
                            signal: controllerRef.current.signal,
                        }
                    );
                    let parsed: Option[];
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

    const handleSelect = (item: Option) => {
        let updatedValue: Option[] | null = clone(selectedValue);
        if (props.multiple) {
            if (updatedValue) {
                updatedValue.push(item);
            } else {
                updatedValue = [item]
            }
        } else {
            updatedValue = [item];
        }

        setSelectedValue(updatedValue);
        setSearchValue('');
        handleChange(updatedValue)
    }

    const handleChange = (updatedValue: Option[] | null) => {
        if (!updatedValue) {
            props.onChange(null);
            return;
        }
        if (props.multiple) {
            props.onChange(updatedValue.map(value => value.value));
        } else {
            props.onChange(updatedValue?.[0]?.value ?? null);
            setData([]);
        }
    }

    const removeSelectedItem = (value: string) => {
        const clonedValue = clone(selectedValue);
        const index = (clonedValue ?? []).findIndex(v => v.value === value);
        if (index > -1) {
            clonedValue?.splice(index, 1);
            setSelectedValue(clonedValue);
            handleChange(clonedValue);
        }
    }

    const handlePopoverClose = () => {
        setData([])
    }

    return (
        <Popover opened={!!data.length} onClose={handlePopoverClose} width={width} zIndex={1000}>
            <Popover.Target>
                <div>
                    <FormLabel
                        label={label}
                        withAsterisk={withAsterisk}
                    />
                    <div className={classes.inputWrapper} onClick={() => inputRef?.current?.focus?.()} ref={ref}>
                        <div className={classes.icon}>
                            {
                                loading ? <Loader size='xs' variant='oval'/> : <IconSearch size={16}/>
                            }
                        </div>
                        {
                            (selectedValue ?? []).map(option => {
                                return (
                                    <Chip
                                        key={option.value}
                                        radius='md'
                                        checked={false}
                                        onClick={() => removeSelectedItem(option.value)}
                                        size='xs'
                                    >
                                        {option.label}
                                        <ActionIcon size='xs' onClick={() => removeSelectedItem(option.value)}>
                                            <IconX size={14}/>
                                        </ActionIcon>
                                    </Chip>
                                )
                            })
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
                        const isSelected = !!(selectedValue ?? []).find(v => v.value === item.value);
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
                                style={{
                                    background: isSelected ? '#e7e7e7' : undefined
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
