import * as React from 'react';
import { Text } from '@mantine/core';
import { useStyles } from './styles'

interface IProps {
    label?: string;
    withAsterisk?: boolean;
}

const FormLabel = ({
    label = '',
    withAsterisk = false
}: IProps) => {
    const { classes } = useStyles();
    return (
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
    )
};

export default FormLabel;