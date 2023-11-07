import * as React from 'react';
import { Drawer } from '@mantine/core';
import { BulkAction } from '@/backoffice-common/types/api/meta';
import Form from '@/backoffice-common/components/form/Form';
import { useConfirmModal } from '@/backoffice-common/hooks';
import { useTranslation } from 'react-i18next';

interface BulkActionModalProps {
    onClose: () => void;
    bulkAction?: BulkAction;
    onSubmit: (values: Record<string, unknown>) => void;
}

const BulkActionDrawer = ({
    onClose,
    bulkAction,
    onSubmit
}: BulkActionModalProps) => {

    const { t } = useTranslation();

    const confirmModal = useConfirmModal();

    const handleSubmit = (values: Record<string, unknown>) => {
        if (bulkAction?.confirmation) {
            confirmModal({
                title: '',
                children: bulkAction.confirmation.dialogText,
                labels: {
                    confirm: bulkAction.confirmation.buttonText ?? 'confirm',
                    cancel: t('cancel', { ns: 'common' })
                },
                async onConfirm() {
                    onSubmit(values);
                }
            })
        } else {
            onSubmit(values)
        }
    }

    return (
        <Drawer
            opened={!!bulkAction}
            onClose={onClose}
            position='right'
        >
            {
                bulkAction?.api?.form && (
                    <Form
                        fields={bulkAction.api.form?.fields}
                        onSubmit={handleSubmit}
                    />
                )
            }
        </Drawer>
    )
}

export default BulkActionDrawer;