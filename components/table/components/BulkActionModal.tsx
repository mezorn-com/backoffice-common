import * as React from 'react';
import { Modal } from '@mantine/core';
import { BulkAction } from '@/backoffice-common/types/api/meta.ts';
import Form from '@/backoffice-common/components/form/Form.tsx';
import { useConfirmModal } from '@/backoffice-common/hooks';
import { useTranslation } from 'react-i18next';

interface BulkActionModalProps {
    onClose: () => void;
    bulkAction?: BulkAction;
    onSubmit: (values: Record<string, unknown>) => void;
}

const BulkActionModal = ({
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
        <Modal opened={!!bulkAction} onClose={onClose}>
            {
                bulkAction?.api?.form && (
                    <Form
                        fields={bulkAction.api.form?.fields}
                        onSubmit={handleSubmit}
                    />
                )
            }
        </Modal>
    )
}

export default BulkActionModal