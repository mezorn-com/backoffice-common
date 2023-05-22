import * as React from 'react';
import { path } from 'ramda';
import { SimpleGrid, createStyles, Anchor } from '@mantine/core';
import type { IFormField } from '@/backoffice-common/types/form';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';

interface IDetailProps {
    fields: IFormField[];
    values: {
        [key: string]: any
    };
    head?: React.ReactNode;
}

const Detail = ({
    fields,
    values,
    head
}: IDetailProps) => {

    const { classes } = useStyles();

    const getDetailValue = (field: IFormField): React.ReactNode => {
        const value = path(field.key.split('.'), values) as string;

        switch (field.renderType) {
            case 'text': {
                return value;
            }
            case 'boolean': {
                return value ? 'Yes' : 'No';
            }
            case 'link': {
                const uri: string = field.uri ?? '';
                return (
                    <Anchor target={'_blank'} href={getSubResourceUrl(uri, [ { match: '{_id}', replace: values._id ??  '' } ])}>{value}</Anchor>
                );
            }
            default: {
                return value;
            }
        }
    }

    return (
        <div className={classes.container}>
            <div>
                {head}
            </div>
            {
                fields.filter(field => field.type === 'render').map((field) => {
                    const value = getDetailValue(field);
                    return (
                        <SimpleGrid key={field.key} cols={2} spacing={'xl'} verticalSpacing={'xl'}>
                            <span className={classes.label}>{field.label}</span>
                            <span className={classes.value}>{value}</span>
                        </SimpleGrid>
                    )
                })
            }
        </div>
    )
};

const useStyles = createStyles((theme) => {
    return {
        label: {
            textAlign: 'left',
            fontWeight: 700,
            color: theme.colors.gray[5],
            fontSize: 12,
            textTransform: 'uppercase'
        },
        value: {
            fontWeight: 600,
            textAlign: 'left'
        },
        container: {
            borderRadius: theme.radius.lg,
            padding: '20px',
            border: `1px solid ${theme.colors.gray[2]}`,
            margin: '1rem'
        }
    }
})

export default Detail;