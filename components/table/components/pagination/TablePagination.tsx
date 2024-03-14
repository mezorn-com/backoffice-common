import * as React from 'react';
import { ActionIcon, type ActionIconProps, NumberInput, Select } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import classes from './Pagination.module.scss';

interface TablePaginationProps {
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageSize: string;
    pageCount: number;
    page: number;
    total?: number;
    onPageSizeChange: (size: number) => void;
    onPageIndexChange: (index: number) => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
    pageSizes: number[];
}

const actionIconProps: ActionIconProps = {
    variant: 'filled',
    color: 'var(--mantine-primary-color-6)',
}

const TablePagination = ({
    canPreviousPage,
    canNextPage,
    pageSize,
    pageCount,
    page,
    onPageSizeChange,
    onPageIndexChange,
    onNextPage,
    onPreviousPage,
    pageSizes,
    total
}: TablePaginationProps) => {

    return (
        <div className={classes.wrapper}>
            <div className={classes.total}>
                {total}
            </div>
            <div className={classes.pagination}>
                <div className={classes.paginationControls}>
                    <ActionIcon
                        {...actionIconProps}
                        onClick={() => onPageIndexChange(0)}
                        disabled={!canPreviousPage}
                    >
                        <IconChevronsLeft size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        {...actionIconProps}
                        onClick={onPreviousPage}
                        disabled={!canPreviousPage}
                    >
                        <IconChevronLeft size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        {...actionIconProps}
                        onClick={onNextPage}
                        disabled={!canNextPage}
                    >
                        <IconChevronRight size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        {...actionIconProps}
                        onClick={() => onPageIndexChange(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        <IconChevronsRight size={16}/>
                    </ActionIcon>
                </div>
                <div className={classes.totalPage}>
                    Page
                    <NumberInput
                        type='text'
                        value={page}
                        onChange={value => {
                            const page = value ? Number(value) : 0;
                            onPageIndexChange(page - 1);
                        }}
                        className={classes.paginationInput}
                        min={1}
                        size='xs'
                    />
                    / {pageCount || 1}
                </div>
                <Select
                    data={pageSizes.map(pageSize => {
                        return { value: `${pageSize}`, label: `${pageSize}` }
                    })}
                    onChange={value => {
                        if (value) {
                            onPageSizeChange(Number(value))
                        }
                    }}
                    wrapperProps={{
                        className: classes.select,
                    }}
                    value={pageSize}
                    size='xs'
                />
            </div>
        </div>
    )
};

export default TablePagination;