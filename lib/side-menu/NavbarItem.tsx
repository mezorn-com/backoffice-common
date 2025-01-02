import * as icons from '@/lib/icons/common';
import { Box, Collapse, Group, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './NavbarItem.module.scss';

interface IProps {
	children?: React.ReactNode[];
	label: string;
	path?: string;
	icon?: string;
	isActive?: boolean;
}

const NavbarItem = ({ children, label, path, icon, isActive }: IProps) => {
	const hasLinks = !!children?.length;
	const navigate = useNavigate();
	const [opened, setOpened] = React.useState(false);

	React.useEffect(() => {
		setOpened(!!isActive);
	}, [isActive]);

	const handleClick = () => {
		if (hasLinks) {
			setOpened(o => !o);
		} else {
			navigate(path ?? '/');
		}
	};

	const menuIcon: React.ReactNode = React.useMemo(() => {
		if (!icon) {
			return null;
		}
		// @ts-expect-error
		const Icon = icons[`Icon${icon}`];
		if (!Icon) {
			console.warn(`Icon not found: ${icon}`);
			return null;
		}
		return <Icon size='24px' stroke={1.5} style={{ flexShrink: 0 }} />;
	}, [icon]);

	return (
		<div
			style={{
				paddingLeft: '10px'
			}}
		>
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
						<Box ml='md' style={{ lineHeight: '110%' }}>
							{label}
						</Box>
					</Box>
					{hasLinks && (
						<IconChevronRight
							className={classes.chevron}
							size='1rem'
							stroke={1.5}
							style={{
								transform: opened ? 'rotate(90deg)' : 'none'
							}}
						/>
					)}
				</Group>
			</UnstyledButton>
			{hasLinks ? (
				<div className={classes.children}>
					<Collapse in={opened}>{children}</Collapse>
				</div>
			) : null}
		</div>
	);
};

export default NavbarItem;
