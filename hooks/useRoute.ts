import * as React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { IStringReplacer } from '@/backoffice-common/types/utils';

interface IConfig {
    apiRoute: string;
}

const useRoute = ({
    apiRoute
}: IConfig) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const API_URL = React.useMemo(() => {
        const array: IStringReplacer[] = [];
        for (const key of Object.keys(params)) {
            const paramValue = params[key];
            if (paramValue) {
                if (key !== '*') {
                    array.push({
                        match: `:${key}`,
                        replace: paramValue
                    })
                }
            }
        }
        return getSubResourceUrl(apiRoute, array);
    }, [params]);

    const routes = {
        new: `${pathname}/new`
    }

    return {
        API_URL,
        routes,
        params
    }
};

export default useRoute;