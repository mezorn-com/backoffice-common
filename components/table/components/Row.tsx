import * as React from 'react';
import { COLUMN_UID_ATTR, getDOMRectObserver, ROW_PREFIX } from '../utilts';
import { createStyles } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';

export enum RowSection {
    HEADER = 'header',
    BODY = 'body',
    FOOTER = 'footer'
}

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
    rowSection: RowSection;
}

const useStyles = createStyles(() => {
    return {
        container: {
            display: 'flex'
        }
    }
})

const getColumns = (sectionElement: HTMLDivElement, columnId: string) => {
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

const TableRow = ({
    children,
    rowId,
    rowSection
}: TableRowProps) => {

    const { classes } = useStyles();
    const headerRowRef = React.useRef<HTMLDivElement>(null);
    const forceUpdate = useForceUpdate();
    // const context = React.useContext(TableContext);

    React.useEffect(() => {
        if (headerRowRef.current) {
            forceUpdate();
        }
    }, [headerRowRef.current])

    React.useEffect(() => {
        // if (rowSection === RowSection.HEADER && headerRowRef.current) {
        //     const headerMutationObserver = new MutationObserver((mutationList) => {
        //         for (const mutation of mutationList) {
        //             if (mutation.type === "childList") {
        //                 if (mutation.addedNodes) {
        //                     Array.from(mutation.addedNodes).forEach((columnHeaderElement) => {
        //                         if (columnHeaderElement instanceof HTMLDivElement) {
        //                             const id = columnHeaderElement.getAttribute(COLUMN_UID_ATTR);
        //                             if (id) {
        //                                 const sectionElement = columnHeaderElement?.parentElement?.parentElement?.parentElement;
        //                                 const columnItems: HTMLDivElement[] = [columnHeaderElement];
        //                                 if (sectionElement) {
        //                                     // TODO: Remove class selector.
        //                                     const sectionBodyElement = sectionElement.querySelector('.tbody');
        //                                     if (sectionBodyElement) {
        //                                         for (const row of sectionBodyElement.children) {
        //                                             for (const cell of row.children) {
        //                                                 if (cell.getAttribute(COLUMN_UID_ATTR) === id && cell instanceof HTMLDivElement) {
        //                                                     columnItems.push(cell)
        //                                                 }
        //                                             }
        //                                         }
        //                                     }
        //                                 }
        //                                 const observer = getDOMRectObserver('width');
        //                                 for (const columnItem of columnItems) {
        //                                     observer.observe(columnItem);
        //                                 }
        //                             }
        //                         }
        //                     })
        //                 }
        //             }
        //         }
        //     })
        //     headerMutationObserver.observe(headerRowRef.current,{
        //         attributes: false,
        //         childList: true,
        //         subtree: false
        //     });
        //     return () => {
        //         headerMutationObserver.disconnect();
        //     }
        // }

        if (headerRowRef.current) {
            const section = headerRowRef.current.parentElement?.parentElement?.parentElement;
            // console.log('HEADERROW CURRENT>>>', headerRowRef.current);
            if (section && section instanceof HTMLDivElement) {
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === "childList") {
                            if (mutation.addedNodes) {
                                // console.log('NODE>>>', mutation.addedNodes);
                                for (const cell of mutation.addedNodes) {
                                    if (cell instanceof HTMLDivElement) {
                                        const columnId = cell.getAttribute(COLUMN_UID_ATTR)
                                        if (columnId) {
                                            const q = getColumns(section, columnId);
                                            const observer = getDOMRectObserver('width');
                                            const z = [...q.headerCells, ...q.cells];
                                            let highest = 0;
                                            for (const el of z) {
                                                if (el.scrollWidth > highest) {
                                                    highest = el.scrollWidth;
                                                }
                                            }
                                            for (const el of z) {
                                                el.style.width = highest + 'px';
                                                observer.observe(el);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
                observer.observe(headerRowRef.current,{
                    attributes: false,
                    childList: true,
                    subtree: false
                });
            }
            // if (headerRowRef.current.children) {
            //     console.log('CHILDREN>>>', children)
            // }
            // observer hiihees umnu childuud ni render hiigdeed bnaa.
        }
    }, [])

    const customAttrs = {
        [ROW_PREFIX]: rowId
    }

    const renderCell = () => {
        if (!headerRowRef.current) {
            return null;
        }
        return children;
    }

    return (
        <div {...customAttrs} className={classes.container} ref={headerRowRef}>
            {renderCell()}
        </div>
    )
};

export default TableRow;