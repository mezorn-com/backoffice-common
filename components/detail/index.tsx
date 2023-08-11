import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { path } from 'ramda';
import { Anchor, createStyles, SimpleGrid, Button, Flex } from '@mantine/core';
import { FieldType } from '@/backoffice-common/types/form';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import type { IFormField } from '@/backoffice-common/types/form';
import { IDetailPageState } from '@/backoffice-common/hooks/useDetailPage';
import { openConfirmModal } from '@mantine/modals';
import axios from 'axios';
import { IResponse } from '@/backoffice-common/types/api';
import { showMessage } from '@/backoffice-common/lib/notification';
import { useTranslation } from 'react-i18next';
import { IconEdit, IconTrash } from '@tabler/icons-react';

interface IDetailProps {
    id: string;
    head?: React.ReactNode;
    state: IDetailPageState;
    apiUrl: string;
}

const Detail = ({
    id,
    head,
    apiUrl,
    state: {
        values,
        details,
        actions,

    }
}: IDetailProps) => {

    const { classes } = useStyles();
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();

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
                    renderFields.map((field) => {
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

    // const getActionButtons = () => {
    //     const actionButtons: React.ReactNode[] = [];
    //     if (actions.includes('update')) {
    //         actionButtons.push(
    //             <Button
    //                 key={'action-edit'}
    //                 leftIcon={<IconEdit size={18}/>}
    //                 component={Link}
    //                 to={`${location.pathname}/edit`}
    //             >
    //                 {t('action.edit', { ns: 'common' })}
    //             </Button>
    //         )
    //     }
    //     if (actions.includes('delete')) {
    //         actionButtons.push(
    //             <Button
    //                 key={'action-delete'}
    //                 leftIcon={<IconTrash size={18}/>}
    //                 color={'red'}
    //                 onClick={() => {
    //                     openConfirmModal({
    //                         title: t('delete.modalTitle', { ns: 'common' }),
    //                         children: t('delete.description', { ns: 'common' }),
    //                         labels: {
    //                             confirm: t('delete.title', { ns: 'common' }),
    //                             cancel: t('cancel', { ns: 'common' })
    //                         },
    //                         confirmProps: {
    //                             color: 'red',
    //                         },
    //                         async onConfirm() {
    //                             const { data } = await axios.delete<IResponse<any>>(`${apiUrl}/${id}`);
    //                             if (data.success) {
    //                                 showMessage(t('success', { ns: 'common' }), 'green');
    //                                 navigate(-1);
    //                             }
    //                         }
    //                     })
    //                 }}
    //             >
    //                 {t('delete.title', { ns: 'common' })}
    //             </Button>
    //         )
    //     }
    //
    //     return actionButtons;
    // }

    return (
        <div className={classes.container}>
            <div>
                {head}
            </div>
            <Flex
                gap='xs'
                justify="flex-end"
                wrap='wrap'
            >
                {

                }
            </Flex>
            {
                renderDetails(details, values)
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