import axios from 'axios';
import { API_STORAGE_PREFIX, API_UPLOAD_URL } from '@/config';
import type { IFileUploadResponse } from '@/backoffice-common/types/api';
import useStore from '@/store';
import qs from 'qs';

interface IFileUploaderConfig {
    useFileName: boolean;
    folderPath: string;
    prefix: string;
}

const getFileArraySize = (array: File[]) => {
    return array.reduce(function (acc, obj) { return acc + obj.size; }, 0);
}

// 4_194_304 max size. 4mb
const MAX_UPLOAD_SIZE = 4_194_304;

export const uploadFile = (payload: File | File[], config: IFileUploaderConfig) => {
    const files = payload;

    if (!Array.isArray(files)) {
        return new Promise(async (resolve) => {
            if (files.size <= MAX_UPLOAD_SIZE) {
                const result = await uploadFileNormally(files, config);
                resolve(result);
            } else {
                const result = await uploadWithSignedURL(files, config);
                resolve(result);
            }
        })
    }
    // image size aas hamaarch niiluuleed duudah
    // requests will be either (array of file or file) array
    // if request item is array those files can be uploaded in single upload request.
    // if request is file that means file is larger than max size and need to be uploaded separately.
    const requests: (File | File[])[] = [];

    let tempArray = [];
    for (const file of files) {
        const fileSize = file.size;
        if (fileSize > MAX_UPLOAD_SIZE) {
            requests.push(file);
        }
        if ((getFileArraySize(tempArray) + fileSize) > MAX_UPLOAD_SIZE) {
            requests.push(tempArray);
            tempArray = [];
        } else {
            tempArray.push(file);
        }
    }

    return new Promise(async (resolve, reject) => {
        const urls = [];
        for (const request of requests) {
            if (Array.isArray(request)) {
                const result = await uploadFileNormally(request, config);
                urls.push(...result);
            } else {
                // Upload with signed url
                const result = await uploadWithSignedURL(request, config);
                urls.push(result);
            }
        }
        resolve(urls);
    })
}

export const uploadFileNormally = (payload: File | File[], config: IFileUploaderConfig): Promise<string | string[]> => {
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

            const state = useStore.getState();

            const params: Record<string, unknown> = {
                useFileName: config?.useFileName ?? false,
            }
            if (config.folderPath) {
                params.folderPath = config.folderPath
            }
            if (config.prefix) {
                params.prefix = config.prefix
            }
            const queryParams = qs.stringify(params);
            const response = await axios<IFileUploadResponse>({
                url: `${API_UPLOAD_URL}/upload?${queryParams}`,
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${state.auth.token}`,
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

export const uploadWithSignedURL = (file: File, config: IFileUploaderConfig) => {
    return new Promise(async (resolve, reject) => {
        try {
            const bodyParams = {
                fileName: file.name,
                prefix: config?.prefix ?? config.folderPath ?? undefined,
                useFileName: config.useFileName || false,
                folderPath: config.folderPath ?? undefined
            };

            const state = useStore.getState();

            const signedUrlResponse = await axios({
                method: 'POST',
                url: `${API_UPLOAD_URL}/geturl`,
                data: bodyParams,
                headers: {
                    Authorization: `Bearer ${state.auth.token}`,
                },
            });
            const signedURL = signedUrlResponse?.data?.result?.uploadUrl ?? '';
            const fileUrl = signedUrlResponse?.data?.result?.fileUrl ?? undefined;

            const uploadResponse = await axios({
                url: signedURL,
                method: 'PUT',
                headers: {
                    'Content-Type': file?.type,
                },
                noAuthorization: true,
                data: file,
            });

            if (uploadResponse.status === 200) {
                resolve(fileUrl);
            }
            reject();

        } catch (e) {
            if (e instanceof Error) {
                console.log('Upload with Signed URL error: ', e.message);
                reject();
            }
        }
    })
}