import { RowGroup } from '../types';

interface ColumnSize {
    colId: string;
    additionalWidth?: number;
    innerWidth: number;
}

interface RowSize {
    rowId: string;
    height: number;
}

type RowSizes = Record<RowGroup, RowSize[]>;

export const ROW_UID_ATTR = 'table-row-id';
export const COLUMN_UID_ATTR = 'table-column-id';
export const ROW_GROUP_UID_ATTR = 'table-row-group';

export const getDOMRectObserver = (key: keyof Omit<DOMRectReadOnly, 'toJSON' | 'x' | 'y'>) => {
    return new ResizeObserver((entries) => {
        let value = 0;
        for (const entry of entries) {
            if (entry.contentRect[key] > value) {
                value = entry.contentRect[key];
            }
        }
        for (const entry of entries) {
            if (entry.contentRect[key] < value) {
                if (entry.target instanceof HTMLElement) {
                    entry.target.style[key] = `${value}px`;
                }
            }
        }
    });
}

const getColumnSizes = (horizontalScrollItem: Element) => {
    const columnSizes: ColumnSize[] = [];
    for (const rowGroup of horizontalScrollItem.children) {
        for (const row of rowGroup.children) {
            for (const cell of row.children) {
                const colId = cell.getAttribute(COLUMN_UID_ATTR);
                if (colId) {
                    const innerWidth = cell.children[0].getBoundingClientRect().width;
                    const sizeIndex = columnSizes.findIndex(col => col.colId === colId);
                    if (sizeIndex > -1) {
                        if (innerWidth > columnSizes[sizeIndex].innerWidth) {
                            columnSizes[sizeIndex].innerWidth = Math.ceil(innerWidth);
                        }
                    } else {
                        columnSizes.push({
                            innerWidth,
                            colId
                        })
                    }
                }
            }
        }
    }
    return columnSizes;
}

const getColumnResizes = (centerElement: HTMLElement): ColumnSize[] => {
    const centerSectionWrapper = centerElement.getBoundingClientRect().width;
    const horizontalScrollItem = centerElement.children[0];
    const horizontalScrollItemWidth = horizontalScrollItem.scrollWidth;
    const columnSizes: ColumnSize[] = getColumnSizes(horizontalScrollItem);

    // let exceededWidth: number;
    let exceededWidth: number = centerSectionWrapper - columnSizes.reduce((sum, { innerWidth }) => sum + (innerWidth ?? 0), 0);;

    // if (centerSectionWrapper > horizontalScrollItemWidth) {
    //     console.log('HERE')
    //     // increase column width
    //     exceededWidth = centerSectionWrapper - horizontalScrollItemWidth;
    // } else {
    //     console.log('NO HERE')
    //     // try to reduce width if possible
    //     exceededWidth = centerSectionWrapper - columnSizes.reduce((sum, { innerWidth }) => sum + (innerWidth ?? 0), 0);
    // }
    const widthPerColumn = exceededWidth / columnSizes.length;
    const result = columnSizes.map(((col, index, array) => {
        const isLast = index === array.length - 1;
        return {
            ...col,
            // additionalWidth: 0
            additionalWidth: widthPerColumn
            // additionalWidth: widthPerColumn + (!isLast ? 1 : 0)
        }
    }))

    // const totalAdditionalWidth = result.reduce((sum, val) => sum + val.additionalWidth, 0);
    // const totalInnerWidth = result.reduce((sum, val) => sum + (val.innerWidth ?? 0), 0);

    // console.log('centerElement>>>>', centerElement);
    // console.log('width to fill>>>>>', centerSectionWrapper)
    // console.log('WRAPPER NI>>>', horizontalScrollItem);
    // console.log('EHLEED BGAA UTGA>>>', horizontalScrollItemWidth);
    // console.log('TESTESTTEST>>>>', {
    //     scrollWidth: horizontalScrollItem.scrollWidth,
    //     clientWidth: horizontalScrollItem.clientWidth,
    //     boundRectWidth: horizontalScrollItem.getBoundingClientRect().width
    // })
    // console.log('totalAdditionalWidth>>>>>', totalAdditionalWidth);
    // console.log('totalInnerWidth>>>>>', totalInnerWidth);
    // console.log('totalXXDXD>>>>', totalInnerWidth + totalAdditionalWidth);
    // console.log('exceeded width>>>>', exceededWidth);
    // console.log('COLUMN SIZES>>>>>', result);
    return result
}

const getRowSizes = (table: Element): RowSizes => {
    const object: RowSizes = {
        header: [],
        body: [],
        footer: [],
    }

    for (const section of table.children) {
        const sectionScroll = section.children[0];
        for (const rowGroup of sectionScroll.children) {
            for (const row of rowGroup.children) {
                for (const cell of row.children) {
                    const rowGroup = cell.getAttribute(ROW_GROUP_UID_ATTR) as (RowGroup | null);
                    const rowId = cell.getAttribute(ROW_UID_ATTR);
                    const cellHeight = cell.getBoundingClientRect().height;
                    if (rowId && rowGroup && Object.values(RowGroup).includes(rowGroup)) {
                        const index = object[rowGroup].findIndex(row => row.rowId === rowId);
                        if (index > -1) {
                            if (cellHeight > object[rowGroup][index].height) {
                                object[rowGroup][index].height = cellHeight;
                            }
                        } else {
                            object[rowGroup].push({
                                rowId,
                                height: cellHeight
                            })
                        }
                    }
                }
            }
        }
    }
    return object;
}

export const getCellObserver = () => {
    return new ResizeObserver((entries) => {
        let columnSizes: ColumnSize[] = [];

        // TODO: Remove nested parent selector
        const tableElement = entries[0].target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;

        if (tableElement) {
            const center = tableElement.children[1];
            if (center instanceof HTMLElement) {
                columnSizes = getColumnResizes(center);
            }
            const rowSizes = getRowSizes(tableElement);

            for (const section of tableElement.children) {
                const scrollElement = section.children[0];
                for (const rowGroup of scrollElement.children) {
                    for (const row of rowGroup.children) {
                        for (const cellContainer of row.children) {
                            if (cellContainer) {
                                const columnId = cellContainer.getAttribute(COLUMN_UID_ATTR);
                                const rowId = cellContainer.getAttribute(ROW_UID_ATTR);
                                const columnIndex = columnSizes.findIndex(col => col.colId === columnId);
                                const rowGroup = cellContainer.getAttribute(ROW_GROUP_UID_ATTR) as (RowGroup | null);

                                if (columnId && columnIndex > -1) {
                                    const additionalWidth = ((columnSizes?.[columnIndex]?.additionalWidth ?? 0) > 0 ? columnSizes[columnIndex].additionalWidth : 0) as number;
                                    const width = columnSizes[columnIndex].innerWidth;
                                    if (cellContainer instanceof HTMLElement) {
                                        cellContainer.style.width = width + additionalWidth + 'px';
                                    }
                                }
                                if (rowId && rowGroup && Object.values(RowGroup).includes(rowGroup as RowGroup)) {
                                    const rowIndex = rowSizes[rowGroup].findIndex(row => row.rowId === rowId);
                                    if (rowIndex > -1) {
                                        if (cellContainer instanceof HTMLElement) {
                                            cellContainer.style.height = rowSizes[rowGroup][rowIndex].height + 'px';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}