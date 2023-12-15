import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Collapse, Group, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import * as icons from '@/lib/icons/common';
import classes from './NavbarItem.module.scss';
import { clsx } from 'clsx';

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
        // @ts-expect-error
        const Icon = icons['Icon' + icon];
        if (!Icon) {
            return null;
        }
        return (
            <Icon size="1.1rem" stroke={1.5}/>
        )
    }, [ icon ]);

    return (
        <>
            <UnstyledButton
                onClick={handleClick}
                className={clsx({
                    [classes.control]: true,
                    [classes.active]: isActive
                })}
            >
                <Group justify='space-between' style={{ flexWrap: 'nowrap' }}>
                    <Box
                         className={clsx({
                             [classes.label]: true,
                             [classes.active]: isActive
                         })}
                    >
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