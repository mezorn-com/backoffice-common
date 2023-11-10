import { createStyles } from '@mantine/core';
import { TableSectionType } from '@/backoffice-common/components/table/types';

interface StylesProps {
    sectionType: TableSectionType;
}

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
        },
        head: {
            background: theme.colors.gray[2],
            borderBottom: `1px solid ${theme.colors.gray[5]}`
        },
        body: {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            '::-webkit-scrollbar': {
                width: sectionType === TableSectionType.CENTER ? 0 : undefined,
            }
        },
    }
})