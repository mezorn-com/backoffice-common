import type { IReferenceListResponse } from '@/backoffice-common/types/api';
import axios from 'axios';

export default async function fetchReference(
	refCode: string,
	parent?: string,
	// biome-ignore lint/suspicious/noExplicitAny: TODO: use types
): Promise<any[]> {
	const params = {
		filter: {
			parent: parent ?? refCode,
			root: refCode,
		},
	} as const;
	const { data } = await axios.post<IReferenceListResponse>(
		'/api/references/list',
		params,
	);
	return data.data.docs;
}
