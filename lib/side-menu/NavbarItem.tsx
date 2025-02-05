import { Box, Collapse, Group, Menu, Tooltip, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import * as icons from '@/lib/icons/common';

import classes from './NavbarItem.module.scss';

interface IProps {
	children?: React.ReactNode[];
	label: string;
	path?: string;
	icon?: string;
	isActive?: boolean;
	collapse?: boolean;
}

const NavbarItem = ({ children, label, path, icon, isActive, collapse }: IProps) => {
	const hasLinks = !!children?.length;
	const navigate = useNavigate();
	const [ opened, setOpened ] = React.useState(false);

	React.useEffect(() => {
		setOpened(!!isActive);
	}, [ isActive ]);

	const handleClick = () => {
		if (hasLinks) {
			setOpened(prev => !prev);
		} else {
			navigate(path ?? '/');
		}
	};

	const menuIcon: React.ReactNode = React.useMemo(() => {
		if (!icon) {
			return null;
		}
		// @ts-expect-error using icon dynamically
		const Icon = icons[`Icon${icon}`];
		if (!Icon) {
			console.warn(`Icon not found: ${icon}`);
			return null;
		}
		return <Icon size='24px' stroke={1.5} style={{ flexShrink: 0 }} />;
	}, [ icon ]);


	return (
		<div
			style={{
				paddingLeft: 10
			}}
		>
			<Menu
				trigger='hover'
				openDelay={100}
				closeDelay={400}
				position='right'
			>
				<Menu.Target>
					<Tooltip
						label={label}
						disabled={collapse}
						zIndex={1000}
						position='top'
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
									{hasLinks && !collapse && (
										<IconChevronRight
											className={classes.chevron}
											size='1rem'
											stroke={1.5}
											style={{
												minWidth: 16
											}}
										/>
									)}
									{collapse && (
										<Box
											ml='md'
											style={{ lineHeight: '110%' }}
										>
											{label}
										</Box>
									)}
								</Box>
								{hasLinks && collapse && (
									<IconChevronRight
										className={classes.chevron}
										size='1rem'
										stroke={1.5}
										style={{
											transform: opened ? 'rotate(90deg)' : 'none',
											minWidth: 16
										}}
									/>
								)}
							</Group>
						</UnstyledButton>
					</Tooltip>

				</Menu.Target>
				{hasLinks && !collapse && (
					<Menu.Dropdown
						styles={{
							dropdown: {
								padding: '10px 10px 5px 0',
							}
						}}

					>
						{children}
					</Menu.Dropdown>
				)}
			</Menu>
			{hasLinks && collapse ? (
				<div className={classes.children}>
					<Collapse in={opened}>{children}</Collapse>
				</div>
			) : null}
		</div>
	);
};

export default NavbarItem;
