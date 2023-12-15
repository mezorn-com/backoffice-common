import { openConfirmModal } from '@mantine/modals';
import { OpenConfirmModal } from '@mantine/modals/lib/context';
import { useTranslation } from 'react-i18next';

export const useConfirmModal = () => {
    const { t } = useTranslation();
    return (config: OpenConfirmModal) => {
        openConfirmModal({
            title: t('delete.modalTitle', { ns: 'common' }),
            children: t('delete.description', { ns: 'common' }),
            labels: {
                confirm: t('delete.title', { ns: 'common' }),
                cancel: t('cancel', { ns: 'common' })
            },
            confirmProps: {
                color: 'red',
            },
            async onConfirm() {
                // onConfirm()
                // const id = last(pathname.split('/'));
                // const { data } = await axios.delete<IResponse<any>>(`${apiRoute}/${id}`);
                // if (data.success) {
                //     showMessage(t('success', { ns: 'common' }), 'green');
                //     // void fetchData();
                // }
            },
            ...config
        })
    }
}