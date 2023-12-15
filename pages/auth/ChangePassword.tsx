import * as React from 'react';
import { Modal, PasswordInput, Group, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';

interface IProps {
    opened: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
}

const ChangePassword = ({
    onClose,
    opened,
    onSubmit
}: IProps) => {

    const { t } = useTranslation();

    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            confirmPassword: (value, values) =>
                value !== values.password ? t('passwordDidNotMatch', { ns: 'auth' }) : null,
        },
        validateInputOnChange: true
    });

    const handleSubmit = (values: typeof form.values) => {
        onSubmit(values.password);
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            closeOnClickOutside={false}
            closeOnEscape={false}
            withCloseButton={false}
            title={t('changePassword', { ns: 'auth' })}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <PasswordInput
                    label={t('password', { ns: 'auth' })}
                    placeholder={t('password', { ns: 'auth' })}
                    {...form.getInputProps('password')}
                />

                <PasswordInput
                    mt="sm"
                    label={t('confirmPassword', { ns: 'auth' })}
                    placeholder={t('confirmPassword', { ns: 'auth' })}
                    {...form.getInputProps('confirmPassword')}
                />

                <Group justify='flex-end' mt="md">
                    <Button type="submit">{t('action.submit', { ns: 'common' })}</Button>
                </Group>
            </form>
        </Modal>
    )
}

export default ChangePassword;