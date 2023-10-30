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