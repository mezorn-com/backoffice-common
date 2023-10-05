import { createStyles } from '@mantine/core';

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
        row: {
            display: 'flex',
        },


        container: {
            height: '100%',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
        },
        table: {
            borderCollapse: 'separate',
            borderSpacing: 0,
            borderRadius: theme.radius.md,
            borderStyle: 'solid',
            borderColor: theme.colors.gray[2],
            border: 0,
            width: '100%',
            '> thead': {
                '> tr': {
                    '&:first-of-type': {
                        th: {
                            borderStyle: 'solid',
                            borderColor: theme.colors.gray[1],
                            borderTopWidth: 1,
                            '&:first-of-type': {
                                borderTopLeftRadius: theme.radius.md,
                                borderLeftWidth: 1,
                            },
                            '&:last-of-type': {
                                borderTopRightRadius: theme.radius.md,
                                borderRightWidth: 1,
                            }
                        }
                    },
                }
            },
            '> tbody': {
                '> tr': {
                    td: {
                        borderStyle: 'solid',
                        borderColor: commonBorderStyle.borderColor,
                        '&:first-of-type': {
                            borderLeftWidth: 1,
                        },
                        '&:last-of-type': {
                            borderRightWidth: 1,
                        }
                    },
                    '&:last-of-type': {
                        td: {
                            borderBottomWidth: 1,
                            '&:first-of-type': {
                                borderBottomLeftRadius: theme.radius.md,
                            },
                            '&:last-of-type': {
                                borderBottomRightRadius: theme.radius.md,
                                borderRightWidth: 1,
                            }
                        }
                    }
                }
            },
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
        // headerCell: {
        //     ...commonBorderStyle,
        //     padding: `1rem ${theme.spacing.md}`,
        //     backgroundColor: theme.colors.gray[1],
        //     fontSize: '12px',
        //     textAlign: 'left',
        //     color: theme.colors.gray[6],
        //     width: '100%',
        // },
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
            display: 'flex',
            flex: 1,
            marginTop: theme.spacing.md,
            marginBottom: theme.spacing.md,
            overflow: 'hidden',
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
