import * as React from 'react';
import { INormalField } from '@/backoffice-common/types/form';

interface ITableFilterProps {
    filter: INormalField[];
}

const TableFilter = ({
    filter
}: ITableFilterProps) => {
    return (
        <div>
            {
                filter?.map(filterItem => {
                    return (
                        <div key={filterItem.key}>
                            {filterItem.label}
                        </div>
                    )
                })
            }
        </div>
    )
};

export default TableFilter;