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

export const getTableBodyMutationObserver = () => {
    return new MutationObserver((mutationList, observer) => {
        // remove resize observer when observed element removed from DOM.
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                if (mutation.addedNodes) {
                    Array.from(mutation.addedNodes).forEach((rowElement) => {
                        if (rowElement instanceof HTMLDivElement && rowElement.getAttribute(ROW_PREFIX)) {
                            const rowId = rowElement.getAttribute(ROW_PREFIX);
                            // TODO make selector shorter
                            const sectionElement = rowElement?.parentElement?.parentElement?.parentElement;
                            const table = sectionElement?.parentElement;
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

export const getColumns = (sectionElement: HTMLDivElement, columnId: string) => {
    let headerCells: HTMLDivElement[] = [];
    const thead = sectionElement.querySelector('.thead');
    for (const headerRow of (thead?.children ?? [])) {
        for (const headerCell of headerRow.children) {
            if (headerCell.getAttribute(COLUMN_UID_ATTR) === columnId && headerCell instanceof HTMLDivElement) {
                headerCells.push(headerCell);
            }
        }
    }

    const tbody = sectionElement.querySelector('.tbody');
    let cells: HTMLDivElement[] = [];

    for (const row of (tbody?.children ?? [])) {
        for (const cell of row.children) {
            if (cell.getAttribute(COLUMN_UID_ATTR) === columnId && cell instanceof HTMLDivElement) {
                cells.push(cell);
            }
        }
    }
    return {
        headerCells,
        cells
    }
}