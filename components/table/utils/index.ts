type Selector = '.thead' | '.tbody';

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

export const assignZ = (rowElement: Node, selector: Selector) => {
    if (rowElement instanceof HTMLDivElement && rowElement.getAttribute(ROW_PREFIX)) {
        const rowId = rowElement.getAttribute(ROW_PREFIX);
        // TODO make selector shorter
        const sectionElement = rowElement?.parentElement?.parentElement?.parentElement;
        const table = sectionElement?.parentElement;
        if (table instanceof HTMLElement && rowId) {
            let sectionRows: HTMLDivElement[] = [];
            Array.from(table?.children ?? '').forEach(section => {
                // TODO: replace className selector
                const sectionBody = section.querySelector(selector)?.children;
                if (sectionBody) {
                    Array.from(sectionBody).forEach(row => {
                        if (selector === '.tbody') {
                            if (row.getAttribute(ROW_PREFIX) === rowId) {
                                row instanceof HTMLDivElement && sectionRows.push(row);
                            }
                        } else if (selector === '.thead') {
                            const z = row.getAttribute(ROW_PREFIX)
                            if (z) {
                                const id = rowId.split('_')[1];
                                const x = z.split('_')[1];
                                if (id === x) {
                                    row instanceof HTMLDivElement && sectionRows.push(row);
                                    console.log('row>>>', row.getBoundingClientRect().height, row)
                                }
                            }
                        }
                    })
                }
            })
            // const heightObserver = getDOMRectObserver('height');
            // for (const row of sectionRows) {
            //     heightObserver.observe(row);
            // }
        }
    }
}

export const getTableRowMutationObserver = (selector: Selector) => {
    return new MutationObserver((mutationList, observer) => {
        // remove resize observer when observed element removed from DOM.
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {
                if (mutation.addedNodes) {
                    Array.from(mutation.addedNodes).forEach((rowElement) => {
                        assignZ(rowElement, selector)
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

export const getCenterTableWidthObserver = () => {
    return new ResizeObserver((entries) => {
        for (const entry of entries) {
            // check if actions column is rendered
            if (entry.target.parentElement?.children?.[2]?.querySelector('.tbody')?.children.length) {
                const sectionWidth = entry.contentRect.width
                const sectionTableWidth = entry.target.children[0].getBoundingClientRect().width;
                if (sectionWidth > sectionTableWidth) {
                    // why is it invoking twice
                    const tbody = entry.target.querySelector(('.tbody'));
                    const thead = entry.target.querySelector(('.thead'));
                    if (thead) {
                        for (const row of thead.children) {
                            const colCount = row.children.length;
                            const colWidth = sectionWidth / colCount;
                            for (const cell of row.children) {
                                if (cell instanceof HTMLDivElement) {
                                    cell.style.width = colWidth + 'px';
                                }
                            }
                        }
                    }
                    if (tbody) {
                        for (const row of tbody.children) {
                            const colCount = row.children.length;
                            const colWidth = sectionWidth / colCount;
                            for (const cell of row.children) {
                                if (cell instanceof HTMLDivElement) {
                                    cell.style.width = colWidth + 'px';
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}

export const getCellObserver = () => {
    return new ResizeObserver((entries) => {
        // TODO: make improvements
        for (const entry of entries) {
            const { target, contentRect } = entry;
            const columnId = target.getAttribute(COLUMN_UID_ATTR);
            let rowId = target.getAttribute(ROW_PREFIX);
            const isHeaderColumn = target.getAttribute('header-col') === 'true';

            const tbodyOrThead = target.parentElement?.parentElement;
            const wrapper = tbodyOrThead?.parentElement?.parentElement?.parentElement;
            if (wrapper) {
                const rows = [];
                for (const section of wrapper.children) {
                    const colCells = [];
                    const head = section.querySelector('.thead');
                    const body = section.querySelector('.tbody');

                    if (head) {
                        for (const row of head.children) {
                            if (row.getAttribute(ROW_PREFIX) === rowId) {
                                isHeaderColumn && rows.push(row);
                            }

                            for (const cell of row.children) {
                                if (cell.getAttribute(COLUMN_UID_ATTR) === columnId) {
                                    colCells.push(cell);
                                }
                            }

                        }
                    }

                    if (body) {
                        for (const row of body.children) {
                            if (row.getAttribute(ROW_PREFIX) === rowId) {
                                !isHeaderColumn && rows.push(row);
                            }

                            for (const cell of row.children) {
                                if (cell.getAttribute(COLUMN_UID_ATTR) === columnId) {
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
                        // @ts-ignore
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
                        // @ts-ignore
                        cell.style.height = maxHeight + 'px';
                    }
                }

            }
        }
    })
}