import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => {
    const commonBorderStyle = {
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: theme.colors.gray[3],
    }
    return {
        container: {
            height: '100%',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
        },
        table: {
            borderCollapse: 'collapse',
            borderSpacing: 0,
            borderRadius: theme.radius.md,
            borderStyle: 'solid',
            borderColor: theme.colors.gray[2],
            border: 0,
            width: '100%',
            'thead > tr > th:first-child': {
                borderTopLeftRadius: theme.radius.md
            },
            'thead > tr > th:last-child': {
                borderTopRightRadius: theme.radius.md,
            },
            'tbody > tr > td:first-child': {
                borderBottomLeftRadius: theme.radius.md,
            },
            'tbody > tr > td:last-child': {
                borderBottomRightRadius: theme.radius.md,
            }
        },
        cell: {
            ...commonBorderStyle,
            padding: `0.5rem ${theme.spacing.md}`,
            borderTop: `1px solid ${theme.colors.gray[2]}`,
            overflow: 'hidden',
            fontSize: '15px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontWeight: 400,
        },
        headerCell: {
            ...commonBorderStyle,
            padding: `1rem ${theme.spacing.md}`,
            backgroundColor: theme.colors.gray[1],
            fontSize: '12px',
            textAlign: 'left',
            color: theme.colors.gray[6],
            width: '100%',
            minWidth: '200px',
        },
        pagination: {
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            justifyContent: 'end',
            alignItems: 'center',
            marginBottom: theme.spacing.sm
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
        actionButtons: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '5px',
            justifyContent:'end'
        },
        totalPage: {
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
        },
        tableWrapper: {
            flex: 1,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            overflow: 'auto',
            'thead th': {
                position: 'sticky',
                top: 0,
                zIndex: 1,
                overflow: 'hidden'
            },
            'tbody th': {
                position: 'sticky',
                left: 0
            }
        },
        noData: {
            display: 'flex',
            height: 200,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
})