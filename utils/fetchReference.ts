import axios from 'axios';
import type { IReferenceListResponse } from '@/backoffice-common/types/api';

export default function fetchReference(refCode: string, parent?: string): Promise<any[]> {
    return new Promise(async resolve => {
        const params = {
            filter: {
                parent: parent ?? refCode,
                root: refCode
            }
        } as const;
        const { data } = await axios.post<IReferenceListResponse>(`/api/references/list`, params);
        resolve(data.data.docs);
    })
}