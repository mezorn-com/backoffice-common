import { useEffect, RefObject } from 'react';
import { COLUMN_UID_ATTR, getColumns, getDOMRectObserver } from '@/backoffice-common/components/table/utilts';

export const useRowMutationObserver = (rowRef: RefObject<HTMLDivElement>) => {
    useEffect(() => {
        if (rowRef.current) {
            const section = rowRef.current.parentElement?.parentElement?.parentElement;
            if (section && section instanceof HTMLDivElement) {
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === "childList") {
                            if (mutation.addedNodes) {
                                for (const cell of mutation.addedNodes) {
                                    if (cell instanceof HTMLDivElement) {
                                        const columnId = cell.getAttribute(COLUMN_UID_ATTR)
                                        if (columnId) {
                                            const columns = getColumns(section, columnId);
                                            const observer = getDOMRectObserver('width');
                                            const allColumns = [...columns.headerCells, ...columns.cells];
                                            let maxWidth = 0;
                                            for (const col of allColumns) {
                                                if (col.scrollWidth > maxWidth) {
                                                    maxWidth = col.scrollWidth;
                                                }
                                            }
                                            for (const col of allColumns) {
                                                col.style.width = `${maxWidth}px`;
                                                observer.observe(col);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
                observer.observe(rowRef.current,{
                    attributes: false,
                    childList: true,
                    subtree: false
                });
            }
        }
    }, []);
}