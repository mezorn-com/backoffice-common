import { AppShell, Box, Burger, Group } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { type ReactNode, useEffect, useState } from 'react';

import Profile from '@/backoffice-common/components/profile';
import SideMenu from '@/backoffice-common/lib/side-menu';
import classes from '@/backoffice-common/routes/Protected.module.scss';

interface AppContainerProps {
	children?: ReactNode;
}

const AppContainer = ({ children }: AppContainerProps) => {
	const [ opened, { toggle } ] = useDisclosure();
	const [ collapse, setCollapse ] = useState(true);

	const isDesktop = useMediaQuery('(min-width: 48em)');

	useEffect(() => {
		if(!isDesktop) {
			setCollapse(!isDesktop);
		}
	}, [ isDesktop ]);

	const changeCollapseWidth = () => {
		setCollapse(!collapse);
	};

	return (
		<AppShell
			header={{ height: { base: 60 }, collapsed: isDesktop }}
			navbar={{
				width: collapse ? 300 : 115,
				breakpoint: 'sm',
				collapsed: { mobile: !opened }
			}}
			classNames={{ main: classes.main }}
		>
			<AppShell.Header>
				<Group
					h='100%'
					pr='sm'
					w='100%'
					justify='space-between'
				>
					<Box hiddenFrom='sm' style={{ display: 'flex' }}>
						<Profile compact />
					</Box>
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom='sm'
						size='sm'
					/>
				</Group>
			</AppShell.Header>
			<SideMenu toggle={changeCollapseWidth} collapse={collapse}/>
			<AppShell.Main>
				<div style={{ height: '100dvh' }}>{children}</div>
			</AppShell.Main>
		</AppShell>
	);
};

export default AppContainer;
