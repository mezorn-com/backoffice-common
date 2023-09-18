import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Collapse, createStyles, Group, rem, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import * as icons from './Icons';

interface IStyleParams {
    isActive: boolean;
    hasLinks: boolean;
}

const useStyles = createStyles((theme, { isActive, hasLinks }: IStyleParams) => {
    return {
        control: {
            fontWeight: 500,
            display: 'block',
            width: '100%',
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            fontSize: theme.fontSizes.sm,
            background: isActive && !hasLinks ? theme.colors.gray[1] : undefined,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },
        link: {
            fontWeight: 500,
            display: 'block',
            textDecoration: 'none',
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            paddingLeft: rem(31),
            marginLeft: rem(30),
            fontSize: theme.fontSizes.sm,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
            borderLeft: `${rem(1)} solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
            }`,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            },
        },

        chevron: {
            transition: 'transform 200ms ease',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            color: hasLinks && isActive ? theme.colors[theme.primaryColor] : undefined,
        },
        children: {
            marginLeft: '1rem',
            borderLeftWidth: 1,
            borderLeftStyle: 'solid',
            borderColor: theme.colors.gray[3]
        }
    }}
);

interface IProps {
    children?: React.ReactNode[];
    label: string;
    path?: string;
    icon?: string;
    isActive?: boolean;
}

const NavbarItem = ({
    children,
    label,
    path,
    icon,
    isActive
}: IProps) => {

    const hasLinks = !!children?.length;
    const navigate =  useNavigate();
    const { classes, theme } = useStyles({ isActive: !!isActive, hasLinks });
    const [ opened, setOpened ] = React.useState(false);

    React.useEffect(() => {
        setOpened(!!isActive);
    }, [ isActive ])

    const handleClick = () => {
        if (hasLinks) {
            setOpened((o) => !o);
        } else {
            navigate(path ?? '/');
        }
    }

    const menuIcon: React.ReactNode = React.useMemo(() => {
        if (!icon) {
            return null;
        }
        // @ts-ignore
        const Icon = icons['Icon' + icon];
        if (!Icon) {
            return null;
        }
        return (
            <ThemeIcon variant="light" size={30}>
                <Icon size="1.1rem" />
            </ThemeIcon>
        )
    }, [ icon ])

    return (
        <>
            <UnstyledButton
                onClick={handleClick}
                className={classes.control}
            >
                <Group position="apart" spacing={0}>
                    <Box className={classes.label}>
                        {menuIcon}
                        <Box ml="md">{label}</Box>
                    </Box>
                    {
                        hasLinks && (
                            <IconChevronRight
                                className={classes.chevron}
                                size="1rem"
                                stroke={1.5}
                                style={{ transform: opened ? `rotate(90deg)` : 'none' }}
                            />
                        )
                    }
                </Group>
            </UnstyledButton>
            <div className={classes.children} >
                {hasLinks ? <Collapse in={opened}>{children}</Collapse> : null}
            </div>
        </>
    )
};

export default NavbarItem;