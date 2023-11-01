import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => {
    return {
        inputWrapper: {
            border: `1px solid ${theme.colors.gray[3]}`,
            borderRadius: theme.radius.sm,
            padding: '.4rem .8rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            '&:focus-within': {
                borderColor: theme.colors[theme.primaryColor]
            },
            gap: rem(3)
        },
        dropdown: {
            maxHeight: 500,
            overflowY: 'auto',
        },
        selectedItem: {
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            color: theme.black,
            margin: theme.spacing.xs,
            border: `1px solid ${theme.colors.gray[2]}`,
            fontSize: 13,
            cursor: 'pointer !important',
            zIndex: 12500,
        },
        input: {
            border: 0,
            outline: 'none',
            flex: 1,
            paddingLeft: theme.spacing.md,
        },
        icon: {
            display: 'grid',
            placeItems: 'center'
        },
        buttonInner: {
            justifyContent: 'flex-start',
            color: theme.black
        }
    }
})