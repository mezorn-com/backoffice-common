import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import type { IStringReplacer } from '@/backoffice-common/types/utils';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';

interface IConfig {
	apiRoute: string;
}

const useRoute = ({ apiRoute }: IConfig) => {
	const { pathname } = useLocation();

	// const navigate = useNavigate();
	const params = useParams();

	const apiUrl = React.useMemo(() => {
		const array: IStringReplacer[] = [];
		for (const key of Object.keys(params)) {
			const paramValue = params[key];
			if (paramValue) {
				if (key !== '*') {
					array.push({
						match: `:${key}`,
						replace: paramValue
					});
				}
			}
		}
		return getSubResourceUrl(apiRoute, array);
	}, [ params, apiRoute ]);

	const routes = {
		new: `${pathname}${pathname.endsWith('/') ? '' : '/'}new`
	};

	return {
		// biome-ignore lint/style/useNamingConvention: const
		API_URL: apiUrl,
		routes,
		params
	};
};

export default useRoute;
