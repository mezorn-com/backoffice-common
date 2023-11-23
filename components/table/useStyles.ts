import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => {
    const borderColor = theme.colors.gray[2];
    return {
        container: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        tableWrapper: {
            flex: 1,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            overflow: 'hidden',
            gap: '1rem',
            width: '100%',
        },
        table: {
            minWidth: '100%',
            display: 'flex',
            maxHeight: '100%',
            overflow: 'hidden',
            border: '1px solid',
            borderColor,
            borderRadius: theme.radius.sm
        },
        header: {
            display: 'flex',
            alignItems: 'center'
        },
        filters: {
            flex: 1
        },
        bulkActions: {
            width: 80
        }
    }
})