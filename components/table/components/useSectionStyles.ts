import { createStyles } from '@mantine/core';
import { TableSectionType } from '@/backoffice-common/components/table/types';

interface StylesProps {
    sectionType: TableSectionType;
}
const headerBackground = '#d7d7d7';
// const cellPadding = '.3rem .5rem';
const cellPadding = 0;

export const useSectionStyles = createStyles((theme, { sectionType }: StylesProps) => {
    return {
        container: {
            overflowX: 'auto',
            overflowY: 'hidden',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: sectionType === TableSectionType.RIGHT ? '10px 0 20px 5px #c7c7c7' : undefined,
            flex: sectionType === TableSectionType.CENTER ? 1 : undefined,
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
            width: 'fit-content',
            // border: '1px solid red',
        },
        head: {
            background: headerBackground,
        },
        body: {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            '::-webkit-scrollbar': {
                width: sectionType === TableSectionType.CENTER ? 0 : undefined,
            }
        },
        headerCell: {
            padding: cellPadding,
            '> div': {
                width: 'min-content',
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
                textAlign: 'center',
            }
        },
        cell: {
            borderBottom: '1px solid',
            borderBottomColor: theme.colors.gray[2],
            padding: cellPadding,
            '> div': {
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
                width: 'min-content'
            }
        },
    }
})