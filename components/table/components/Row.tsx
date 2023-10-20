import * as React from 'react';
import { COLUMN_UID_ATTR, getDOMRectObserver, ROW_PREFIX } from '../utilts';
import { createStyles } from '@mantine/core';
import { TableContext } from '@/backoffice-common/components/table/context';

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

const TableRow = ({
    children,
    rowId,
    rowSection
}: TableRowProps) => {

    const { classes } = useStyles();
    const headerRowRef = React.useRef<HTMLDivElement>(null);
    const context = React.useContext(TableContext);

    React.useEffect(() => {
        if (rowSection === RowSection.HEADER && headerRowRef.current) {
            const headerMutationObserver = new MutationObserver((mutationList) => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        if (mutation.addedNodes) {
                            Array.from(mutation.addedNodes).forEach((columnHeaderElement) => {
                                if (columnHeaderElement instanceof HTMLDivElement) {
                                    const id = columnHeaderElement.getAttribute(COLUMN_UID_ATTR);
                                    if (id) {
                                        const sectionElement = columnHeaderElement?.parentElement?.parentElement?.parentElement;
                                        const columnItems: HTMLDivElement[] = [columnHeaderElement];
                                        if (sectionElement) {
                                            // TODO: Remove class selector.
                                            const sectionBodyElement = sectionElement.querySelector('.tbody');
                                            if (sectionBodyElement) {
                                                for (const row of sectionBodyElement.children) {
                                                    for (const cell of row.children) {
                                                        if (cell.getAttribute(COLUMN_UID_ATTR) === id && cell instanceof HTMLDivElement) {
                                                            columnItems.push(cell)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        const observer = getDOMRectObserver('width');
                                        for (const columnItem of columnItems) {
                                            observer.observe(columnItem);
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            })
            headerMutationObserver.observe(headerRowRef.current,{
                attributes: false,
                childList: true,
                subtree: false
            });
            return () => {
                headerMutationObserver.disconnect();
            }
        }
    }, [])

    const customAttrs = {
        [ROW_PREFIX]: rowId
    }

    return (
        <div  {...customAttrs} className={classes.container} ref={headerRowRef}>
            {children}
        </div>
    )
};

export default TableRow;