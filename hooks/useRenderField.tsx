import { FieldType, IFormField, RenderType } from '@/backoffice-common/types/form';
import * as React from 'react';
import { Anchor, Flex, Stack } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import ImagePreview from '@/backoffice-common/components/common/image-preview';

export const useRenderField = () => {
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
                    <table style={{ width: '100%' }}>
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
                                        return <td key={`${column.key}-${index}`} style={{ fontWeight: 400 }}>{row?.[column.key] ?? '-'}</td>;
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                );
            }
            case RenderType.IMAGE: {
                if (Array.isArray(value)) {
                    return (
                        <Stack gap='xs'>
                            {
                                value.map(src => {
                                    return (
                                        <ImagePreview
                                            src={src}
                                            width={'200'}
                                            height={'100'}
                                        />
                                    )
                                })
                            }
                        </Stack>
                    )
                }
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
};