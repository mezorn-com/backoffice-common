import axios from 'axios';
import type { IReferenceListResponse } from '@/backoffice-common/types/api';

// biome-ignore lint/suspicious/noExplicitAny: TODO: use types
export default async function fetchReference(refCode: string, parent?: string): Promise<any[]> {
    const params = {
        filter: {
            parent: parent ?? refCode,
            root: refCode
        }
    } as const;
    const { data } = await axios.post<IReferenceListResponse>('/api/references/list', params);
    return data.data.docs;
}