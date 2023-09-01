import { createStyles } from '@mantine/core';

export const useFormStyles = createStyles((theme) => {
    return {
        wrapper: {
            padding: '1rem',
        },
        card: {
            overflow: 'visible',
            '.mantine-Card-cardSection': {
                overflow: 'visible',
            },
        }
    }
})