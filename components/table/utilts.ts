export const ROW_PREFIX = 'table-row-id';
export const COLUMN_UID_ATTR = 'table-column-id';

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

export const getMutationObserver = () => {
    return new MutationObserver((mutationList, observer) => {
        // remove resize observer when observed element removed from DOM.
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                if (mutation.addedNodes) {
                    Array.from(mutation.addedNodes).forEach((rowElement) => {
                        // if (rowElement instanceof HTMLDivElement) {
                        //     for (const cell of rowElement.children) {
                        //         const id = cell.getAttribute(COLUMN_UID_ATTR);
                        //         if (id) {
                        //             const sectionElement = cell?.parentElement?.parentElement?.parentElement;
                        //             const columnItems: HTMLDivElement[] = [];
                        //             if (sectionElement) {
                        //                 // TODO: Remove class selector.
                        //                 const sectionBodyElement = sectionElement.querySelector('.tbody');
                        //                 if (sectionBodyElement) {
                        //                     for (const row of sectionBodyElement.children) {
                        //                         for (const cell of row.children) {
                        //                             if (cell.getAttribute(COLUMN_UID_ATTR) === id && cell instanceof HTMLDivElement) {
                        //                                 columnItems.push(cell)
                        //                             }
                        //                         }
                        //                     }
                        //                 }
                        //
                        //                 const sectionHeaderElement = sectionElement.querySelector('.thead');
                        //                 if (sectionHeaderElement) {
                        //                     for (const row of sectionHeaderElement.children) {
                        //                         for (const headerCell of row.children) {
                        //                             if (headerCell.getAttribute(COLUMN_UID_ATTR) === id && headerCell instanceof HTMLDivElement) {
                        //                                 columnItems.push(headerCell)
                        //                             }
                        //                         }
                        //                     }
                        //                 }
                        //
                        //                 // additional code here
                        //             }
                        //             const observer = getDOMRectObserver('width');
                        //             for (const columnItem of columnItems) {
                        //                 observer.observe(columnItem);
                        //             }
                        //         }
                        //     }
                        // }






                        if (rowElement instanceof HTMLDivElement && rowElement.getAttribute(ROW_PREFIX)) {
                            const rowId = rowElement.getAttribute(ROW_PREFIX);
                            // TODO make selector shorter
                            const table = rowElement?.parentElement?.parentElement?.parentElement?.parentElement;
                            if (table instanceof HTMLElement) {
                                let sectionRows: HTMLDivElement[] = [];
                                Array.from(table?.children ?? '').forEach(section => {
                                    // TODO: replace className selector
                                    const sectionBody = section.querySelector('.tbody')?.children;
                                    if (sectionBody) {
                                        Array.from(sectionBody).forEach(row => {
                                            if (row.getAttribute(ROW_PREFIX) === rowId) {
                                                row instanceof HTMLDivElement && sectionRows.push(row);
                                            }
                                        })
                                    }
                                })
                                const heightObserver = getDOMRectObserver('height');
                                for (const row of sectionRows) {
                                    heightObserver.observe(row);
                                }
                            }
                        }
                    })
                }
            }
        }
    })
}