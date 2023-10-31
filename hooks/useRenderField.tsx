import { FieldType, IFormField, RenderType } from '@/backoffice-common/types/form';
import * as React from 'react';
import { Anchor, createStyles, Flex } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import ImagePreview from '@/backoffice-common/components/common/image-preview';

export const useRenderField = () => {
    const { classes } = useStyles();

    return (field: IFormField, value: unknown, data: Record<string, any>): React.ReactNode => {
        if (field.type !== FieldType.RENDER) {
            return null;
        }
        switch(field.renderType) {
            case RenderType.TEXT: {
                if (typeof value === 'string' || typeof value === 'number') {
                    return value;
                }
                break;
            }
            case RenderType.BOOLEAN: {
                if (value === true) {
                    return (
                        <Flex justify='center' align='center'>
                            <IconCircleCheck color='green'/>
                        </Flex>
                    )
                }
                if (value === false) {
                    return (
                        <Flex justify='center' align='center'>
                            <IconCircleX color='red'/>
                        </Flex>
                    )
                }
                return null;
            }
            case RenderType.LINK: {
                if (typeof value === 'string') {
                    const uri: string = field.uri ?? '';
                    return (
                        <Anchor
                            target={'_blank'}
                            href={getSubResourceUrl(uri, [{ match: '{_id}', replace: data?._id ?? '' }])}
                        >
                            {value}
                        </Anchor>
                    );
                }
                break;
            }
            case RenderType.TABLE: {
                return (
                    <table className={classes.table}>
                        <thead>
                        <tr>
                            {field.columns.map(column => {
                                return <th key={column.key}>{column.label}</th>;
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {(Array.isArray(value) ? value : []).map((row, index) => {
                            return (
                                <tr key={index}>
                                    {field.columns.map(column => {
                                        return <td key={`${column.key}-${index}`}>{row?.[column.key] ?? '-'}</td>;
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                );
            }
            case RenderType.IMAGE: {
                return (
                    <ImagePreview
                        src={value as string}
                        width={'200'}
                        height={'100'}
                    />
                )
            }
            default: {
                // @ts-ignore
                console.warn(`Unknown render type "${field.renderType}"`);
                return '-';
            }
        }
        return null;
    }
}

const useStyles = createStyles(theme => {
    return {
        table: {
            width: '100%',
            'tbody > tr > td': {
                fontWeight: 400,
            },
        },
    };
});