import * as React from 'react';
import { Text, TextProps } from '@mantine/core';
import classes from './Label.module.scss';

interface IProps extends TextProps {
    label?: string;
    withAsterisk?: boolean;
}

const FormLabel = ({
    label = '',
    withAsterisk = false,
    ...props
}: IProps) => {
    return (
        <div className={classes.label}>
            {
                label && (
                    <Text fz='sm' fw={500} {...props}>
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
    )
};

export default FormLabel;