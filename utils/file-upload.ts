import axios from 'axios';
import { API_UPLOAD_URL } from '@/config';
import type { IFileUploadResponse } from '@/backoffice-common/types/api';
import useStore from '@/store';
import qs from 'qs';

interface IFileUploaderConfig {
    useFileName: boolean;
    folderPath: string;
    prefix: string;
}

const getFileArraySize = (array: File[]) => {
    return array.reduce((acc, obj) => acc + obj.size, 0);
}

// 4_194_304 max size. 4mb
const MAX_UPLOAD_SIZE = 4_194_304;

export const uploadFile = async (payload: File | File[], config?: IFileUploaderConfig) => {
    const files = payload;

    if (!Array.isArray(files)) {
        // return new Promise(async (resolve) => {
        if (files.size <= MAX_UPLOAD_SIZE) {
            return await uploadFileNormally(files, config);
            // resolve(result);
        }
        return await uploadWithSignedURL(files, config);
                // resolve(result);
        // })
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

    // return new Promise(async (resolve) => {
        const urls = [];
        for (const request of requests) {
            if (Array.isArray(request)) {
                const result = await uploadFileNormally(request, config);
                if (result) {
                    urls.push(...result);
                }
            } else {
                // Upload with signed url
                const result = await uploadWithSignedURL(request, config);
                urls.push(result);
            }
        }
        return urls
        // resolve(urls);
    // })
}

export const uploadFileNormally = async (payload: File | File[], config?: IFileUploaderConfig): Promise<string | string[] | undefined> => {
    // return new Promise(async (resolve, reject) => {
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
                folderPath: config?.folderPath ?? undefined,
                prefix: config?.prefix ?? undefined
            }
            if (config?.folderPath) {
                params.folderPath = config.folderPath
            }
            if (config?.prefix) {
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
                return urls
                // resolve(urls);
            }
            return response?.data?.result?.[0]?.fileUrl ?? undefined
            // resolve(response?.data?.result?.[0]?.fileUrl ?? undefined);
        } catch (e) {
            if (e instanceof Error) {
                console.log('File Upload Error: ', e.message);
                throw e;
                // reject();
            }
        }
    // })
}

export const uploadWithSignedURL = async (file: File, config?: IFileUploaderConfig) => {
    // return new Promise(async (resolve, reject) => {
        try {
            const bodyParams = {
                fileName: file.name,
                prefix: config?.prefix ?? config?.folderPath ?? undefined,
                useFileName: config?.useFileName || false,
                folderPath: config?.folderPath ?? undefined
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
                return fileUrl;
                // resolve(fileUrl);
            }
            throw new Error('File upload error')
            // reject();

        } catch (e) {
            if (e instanceof Error) {
                console.log('Upload with Signed URL error: ', e.message);
                throw e
                // reject();
            }
        }
    // })
}