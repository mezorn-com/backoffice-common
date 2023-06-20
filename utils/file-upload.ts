import axios from 'axios';
import { API_STORAGE_PREFIX, API_UPLOAD_URL } from '@/config';
import type { IFileUploadResponse } from '@/backoffice-common/types/api';

interface IFileUploaderConfig {
    useFileName: boolean;
    folderPath: string;
    prefix: string;
}

export const uploadFile = (payload: File | File[], config?: IFileUploaderConfig): Promise<string | string[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            const isArray = Array.isArray(payload);
            if (isArray) {
                for (const file of payload) {
                    formData.append('files', file);
                }
            } else {
                formData.append('files', payload);
            }

            const useFileName = config?.useFileName ?? false;
            const folderPath = config?.folderPath ?? '';
            const prefix = config?.folderPath ?? API_STORAGE_PREFIX ?? '';
            const response = await axios<IFileUploadResponse>({
                url: `${API_UPLOAD_URL}/upload?useFileName=${useFileName}&folderPath=${folderPath}&prefix=${prefix}`,
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                },
                data: formData,
            });
            if (isArray) {
                const urls = (response.data.result ?? []).map((result) => result?.fileUrl ?? undefined);
                resolve(urls);
            } else {
                resolve(response?.data?.result?.[0]?.fileUrl ?? undefined);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log('File Upload Error: ', e.message);
                reject();
            }
        }
    })
}