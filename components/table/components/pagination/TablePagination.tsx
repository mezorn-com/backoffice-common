import * as React from 'react';
import { ActionIcon, NumberInput, Select } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { useStyles } from './useStyles';

interface TablePaginationProps {
    canPreviousPage: boolean;
    canNextPage: boolean;
    pageSize: string;
    pageCount: number;
    page: number;
    onPageSizeChange: (size: number) => void;
    onPageIndexChange: (index: number) => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
    pageSizes: number[];
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
    pageSizes
}: TablePaginationProps) => {

    const { classes } = useStyles();

    return (
        <div className={classes.pagination}>
            <div className={classes.paginationControls}>
                <ActionIcon
                    variant='filled'
                    color='color.primary'
                    onClick={() => onPageIndexChange(0)}
                    disabled={!canPreviousPage}
                >
                    <IconChevronsLeft size={16}/>
                </ActionIcon>
                <ActionIcon
                    variant='filled'
                    color='color.primary'
                    onClick={onPreviousPage}
                    disabled={!canPreviousPage}
                >
                    <IconChevronLeft size={16}/>
                </ActionIcon>
                <ActionIcon
                    variant='filled'
                    color='color.primary'
                    onClick={onNextPage}
                    disabled={!canNextPage}
                >
                    <IconChevronRight size={16}/>
                </ActionIcon>
                <ActionIcon
                    variant='filled'
                    color='color.primary'
                    onClick={() => onPageIndexChange(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    <IconChevronsRight size={16}/>
                </ActionIcon>
            </div>
            <div className={classes.totalPage}>
                Page
                <NumberInput
                    type="number"
                    value={page}
                    onChange={value => {
                        const page = value ? Number(value) : 0;
                        onPageIndexChange(page);
                    }}
                    style={{ width: '100px' }}
                    className={classes.paginationInput}
                    min={1}
                    size='xs'
                />
                / {pageCount}
            </div>
            <Select
                data={pageSizes.map(pageSize => {return {value: `${pageSize}`, label: `${pageSize}`}})}
                onChange={value => {
                    if (value) {
                        onPageSizeChange(Number(value))
                    }
                }}
                wrapperProps={{
                    style: {
                        width: 80
                    }
                }}
                value={pageSize}
                size='xs'
            />
        </div>
    )
};

export default TablePagination;