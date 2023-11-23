import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => {
    return {
        pagination: {
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            justifyContent: 'end',
            alignItems: 'center',
        },
        paginationControls: {
            display: 'flex',
            flexDirection: 'row',
            gap: '5px',
        },
        paginationControlsButton: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: theme.radius.sm,
            borderWidth: 1,
            borderColor: theme.colors.gray[2],
            ":disabled": {
                backgroundColor: theme.colors.gray[1],
                borderWidth: 0,
            }
        },
        paginationPaging:{
            fontSize: '12px',
            fontWeight: 600,
            color: theme.colors.gray[6]
        },
        paginationInput: {
            maxWidth: '50px',
            height: '35px',
            // border: `1px solid ${theme.colors.gray[2]}`,
            textAlign: 'center',
            borderRadius: theme.radius.sm,
            ":disabled": {
                backgroundColor: theme.colors.gray[1],
                borderWidth: 0,
            }
        },
        totalPage: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
        },
    }
});