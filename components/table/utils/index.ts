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

export const getCellObserver = () => {
    return new ResizeObserver((entries) => {
        // TODO: make code shorter
        for (const entry of entries) {
            const { target, contentRect } = entry;
            const columnId = target.getAttribute(COLUMN_UID_ATTR);
            let rowId = target.getAttribute(ROW_PREFIX);
            const isHeaderColumn = target.getAttribute('header-col') === 'true';

            const tbodyOrThead = target.parentElement?.parentElement;
            const wrapper = tbodyOrThead?.parentElement?.parentElement?.parentElement;
            if (wrapper) {
                const rows: HTMLDivElement[] = [];
                for (const section of wrapper.children) {
                    const colCells: HTMLDivElement[] = [];
                    const head = section.querySelector('.thead');
                    const body = section.querySelector('.tbody');

                    if (head) {
                        for (const row of head.children) {
                            if (row.getAttribute(ROW_PREFIX) === rowId && isHeaderColumn && row instanceof HTMLDivElement) {
                                rows.push(row);
                            }

                            for (const cell of row.children) {
                                if (cell.getAttribute(COLUMN_UID_ATTR) === columnId && cell instanceof HTMLDivElement) {
                                    colCells.push(cell);
                                }
                            }

                        }
                    }

                    if (body) {
                        for (const row of body.children) {
                            if (row.getAttribute(ROW_PREFIX) === rowId && row instanceof HTMLDivElement && !isHeaderColumn) {
                                rows.push(row);
                            }

                            for (const cell of row.children) {
                                if (cell instanceof HTMLDivElement && cell.getAttribute(COLUMN_UID_ATTR) === columnId) {
                                    colCells.push(cell);
                                }
                            }
                        }
                    }

                    let maxWidth = 0;

                    for (const c of colCells) {
                        if (c.getBoundingClientRect().width > maxWidth) {
                            maxWidth = c.getBoundingClientRect().width;
                        }
                    }

                    for (const c of colCells) {
                        c.style.width = maxWidth + 'px';
                    }
                }

                let maxHeight = 0;
                for (const row of rows) {
                    for (const cell of row.children) {
                        if (cell.getBoundingClientRect().height > maxHeight) {
                            maxHeight = cell.getBoundingClientRect().height;
                        }
                    }
                }

                for (const row of rows) {
                    for (const cell of row.children) {
                        if (cell instanceof HTMLDivElement) {
                            cell.style.height = maxHeight + 'px';
                        }
                    }
                }

            }
        }
    })
}