export const ROW_PREFIX = 'table-row-id';

export const getHeightObserver = () => {
    return new ResizeObserver((entries) => {
        let height = 0;
        for (const entry of entries) {
            if (entry.contentRect.height > height) {
                height = entry.contentRect.height;
            }
        }
        for (const entry of entries) {
            if (entry.contentRect.height !== height) {
                if (entry.target instanceof HTMLElement) {
                    entry.target.style.height = `${height}px`;
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
                                const heightObserver = getHeightObserver();
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