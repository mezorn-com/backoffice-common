import * as React from 'react';
import TableComponent from '@/backoffice-common/components/table/TableComponent';
import { ITableProps } from '@/backoffice-common/components/table/types';
import TableContextProvider from '@/backoffice-common/components/table/TableContextProvider';

const Table = (props: ITableProps) => {
    return (
        <TableContextProvider>
            <TableComponent
                {...props}
            />
        </TableContextProvider>
    )
};

export default Table;