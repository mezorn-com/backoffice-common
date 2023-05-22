import { createStyles } from '@mantine/core';

export const useFormStyles = createStyles((theme) => {
    return {
        card: {
            overflow: 'visible',
            '.mantine-Card-cardSection': {
                overflow: 'visible',
            },
        }
    }
})