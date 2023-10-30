import { createStyles } from '@mantine/core';
import { TableSectionType } from '@/backoffice-common/components/table/types';

interface StylesProps {
    sectionType: TableSectionType;
}

export const useSectionStyles = createStyles((theme, { sectionType }: StylesProps) => {
    const headerBackground = '#d7d7d7'
    return {
        container: {
            // overflowX: sectionType === TableSectionType.CENTER ? 'auto': 'hidden',
            overflowX: 'auto',
            overflowY: 'hidden',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: sectionType === TableSectionType.RIGHT ? '10px 0 20px 5px #c7c7c7' : undefined
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow:'hidden'
        },
        head: {
            background: headerBackground,
        },
        headerCell: {
            textAlign: 'center',
            padding: '.3rem'
        },
        body: {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            '::-webkit-scrollbar': {
                width: sectionType === TableSectionType.CENTER ? 0 : undefined,
            }
        },
        cell: {
            borderBottom: '1px solid',
            borderBottomColor: theme.colors.gray[2],
            padding: '.3rem'
        }
    }
})