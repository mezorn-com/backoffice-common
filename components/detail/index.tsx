import * as React from 'react';
import { path } from 'ramda';
import { Anchor, createStyles, SimpleGrid } from '@mantine/core';
import { FieldType } from '@/backoffice-common/types/form';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import type { IFormField } from '@/backoffice-common/types/form';

interface IDetailProps {
    fields: IFormField[];
    values: Record<string, any>
    head?: React.ReactNode;
}

const Detail = ({
    fields,
    values,
    head
}: IDetailProps) => {

    const { classes } = useStyles();

    const getDetailValue = (field: IFormField, detailValues: Record<string, any>): React.ReactNode => {
        if (field.type !== FieldType.RENDER) {
            return null;
        }
        const value = path(field.key.split('.'), detailValues) as string;

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

    const renderDetails = (renderFields: IFormField[], renderValues: Record<string, any>) => {
        return (
            <div className={classes.group} key='group'>
                {
                    renderFields
                        .map((field) => {
                            if (field.type === FieldType.OBJECT) {
                                return renderDetails(field.fields ?? [], renderValues[field.key])
                            }
                            if (field.type === FieldType.GROUP) {
                                return null
                            }
                            const value = getDetailValue(field, renderValues);
                            return (
                                <SimpleGrid key={field.key} cols={2} spacing={50} verticalSpacing={'xl'} className={classes.grid}>
                                    <span className={classes.label}>{field.label}</span>
                                    <span className={classes.value}>{value}</span>
                                </SimpleGrid>
                            )
                        })
                }
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <div>
                {head}
            </div>
            {
                renderDetails(fields, values)
            }
        </div>
    )
};

const useStyles = createStyles((theme) => {
    return {
        grid: {
            borderBottom: `1px solid ${theme.colors.gray[1]}`,
            marginTop: theme.spacing.sm
        },
        label: {
            textAlign: 'right',
            fontWeight: 700,
            color: theme.colors.gray[6],
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
            margin: '1rem',
        },
        group: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.gray[1],
            borderRadius: theme.radius.md,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            padding: theme.spacing.md
        }
    }
})

export default Detail;