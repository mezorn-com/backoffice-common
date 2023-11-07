import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface PathParameters {
    parentId?: string;
    _id?: string;
}

export const usePathParameter = (): PathParameters => {
    const { pathname } = useLocation();

    return useMemo(() => {
        const urlParts = pathname.split('/').filter(part => !!part);

        // /page/6493dc489c8ff670f045a20azd3/edit

        if (urlParts[1]) {
            if (urlParts.length >= 3) {
                if (urlParts.length === 3 && pathname.endsWith('edit')) {
                    /***
                     /page/6493dc489c8ff670f045a20azd3/edit
                     ***/
                    return {
                        _id: urlParts[1],
                    }
                } else {
                    return {
                        parentId: urlParts[1],
                        _id: urlParts?.[3]
                    }
                }
            } else {
                /***
                 /page/6493dc489c8ff670f045a20azd3
                 ***/
                return  {
                    _id: urlParts[1]
                }
            }
        }

        return {}
    }, [pathname])
}