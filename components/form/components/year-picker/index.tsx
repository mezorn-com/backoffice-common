import * as React from 'react';
import { Popover, TextInput, ActionIcon } from '@mantine/core';
import { YearPicker as MantineYearPicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { IconX } from '@tabler/icons-react';

interface YearPickerProps {
    label?: string;
    withAsterisk: boolean;
    value: number | null;
    onChange: (value: number | null) => void;
}

const YearPicker = ({
    label,
    withAsterisk,
    value,
    onChange
}: YearPickerProps) => {

    const [ open, setOpen ] = React.useState(false);

    const handleClear = () => {
        setOpen(false);
        onChange(null);
    }

    return (
        <div>
            <Popover position="bottom-start" shadow="md" opened={open}>
                <Popover.Target>
                    <TextInput
                        label={label}
                        withAsterisk={withAsterisk}
                        value={value ?? 'Он сонгох ...'}
                        readOnly
                        onClick={() => !open && setOpen(true)}
                        rightSection={(
                            <ActionIcon size='sm' onClick={handleClear}>
                                <IconX size={14}/>
                            </ActionIcon>
                        )}
                    />
                </Popover.Target>
                <Popover.Dropdown>
                    <MantineYearPicker
                        onChange={(date) => {
                            const year = dayjs(date).year();
                            onChange(year);
                            setOpen(false);
                        }}
                        value={value ? dayjs(value.toString()).toDate() : undefined}
                        defaultDate={value ? new Date(value, 1) : undefined}
                    />
                </Popover.Dropdown>
            </Popover>
        </div>
    )
};

export default YearPicker;