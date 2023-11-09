import { createStyles } from '@mantine/core';

export const useFormStyles = createStyles((theme) => {
    return {
        wrapper: {
            padding: '1rem',
            maxWidth: 500,
            margin: '0 auto'
        },
        card: {
            overflow: 'visible',
            '.mantine-Card-cardSection': {
                overflow: 'visible',
            },
        },
        checkboxLabel: {
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap'
        }
    }
})