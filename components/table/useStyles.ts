import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => {
    const borderColor = theme.colors.gray[2];
    return {
        container: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: `0 ${rem(20)}`,
        },
        tableWrapper: {
            flex: 1,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            overflow: 'hidden',
            gap: '1rem'
        },
        actionButtons: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '5px',
            justifyContent:'end'
        },
        table: {
            minWidth: '100%',
            display: 'flex',
            maxHeight: '100%',
            // TEMPORARY STYLES HERE,
            border: '1px solid',
            borderColor,
            borderRadius: 6,
            overflow: 'hidden',
        }
    }
})