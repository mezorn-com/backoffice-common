import { createStyles } from '@mantine/core';
import { TableSectionType } from '@/backoffice-common/components/table/types';

interface StylesProps {
    sectionType: TableSectionType;
}

export const useSectionStyles = createStyles((theme, { sectionType }: StylesProps) => {
    return {
        container: {
            overflowX: sectionType === TableSectionType.CENTER ? 'auto': 'hidden',
            overflowY: 'hidden',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column'
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow:'hidden'
        },
        headerCell: {
            textAlign: 'center'
        },
        body: {
            flex: 1,
            overflow:'auto',
            '::-webkit-scrollbar': {
                width: sectionType === TableSectionType.CENTER ? 0 : undefined,
            }
        }
    }
})