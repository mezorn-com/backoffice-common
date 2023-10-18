import { createStyles, rem } from '@mantine/core';

export const useStyles = createStyles((theme) => {
    const commonBorderStyle = {
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: theme.colors.gray[3],
    }
    return {
        headerCell: {
            textAlign: 'center'
        },
        container: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: `0 ${rem(20)}`,
        },
        actionButtons: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '5px',
            justifyContent:'end'
        },
        tableWrapper: {
            flex: 1,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            overflow: 'hidden',
            // overflowX: 'hidden',
            'thead th': {
                position: 'sticky',
                top: 0,
                zIndex: 1,
                overflow: 'hidden'
            },
            'tbody th': {
                position: 'sticky',
                left: 0
            },
            gap: '1rem'
        },
        noData: {
            display: 'flex',
            height: 200,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center'
        },
        z: {
            '::-webkit-scrollbar': {
                width: 0,
            }
        }
    }
})

//     * {
//         box-sizing: border-box;
// }
//
// html {
//     font-family: sans-serif;
//     font-size: 14px;
// }
//
// table,
// .divTable {
//     border: 1px solid lightgray;
//     width: fit-content;
// }
//
// .tr {
//     display: flex;
// }
//
// tr,
// .tr {
//     width: fit-content;
//     height: 30px;
// }
//
// th,
// .th,
//     td,
// .td {
//     box-shadow: inset 0 0 0 1px lightgray;
//     padding: 0.25rem;
// }
//
// th,
// .th {
//     padding: 2px 4px;
//     position: relative;
//     font-weight: bold;
//     text-align: center;
//     height: 30px;
// }
//
// td,
// .td {
//     height: 30px;
// }
//
// .resizer {
//     position: absolute;
//     right: 0;
//     top: 0;
//     height: 100%;
//     width: 5px;
//     background: rgba(0, 0, 0, 0.5);
//     cursor: col-resize;
//     user-select: none;
//     touch-action: none;
// }
//
// .resizer.isResizing {
//     background: blue;
//     opacity: 1;
// }
//
// @media (hover: hover) {
// .resizer {
//         opacity: 0;
//     }
//
// *:hover > .resizer {
//         opacity: 1;
//     }
// }
