export const ROW_PREFIX = 'custom-table-row'

export const getRowClassName = (id: string): string => {
    return `${ROW_PREFIX}-${id}`;
}