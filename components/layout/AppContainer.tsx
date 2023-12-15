import * as React from 'react';
import classes from '@/backoffice-common/routes/Protected.module.scss';
import { AppShell, Box, Burger, Group } from '@mantine/core';
import Profile from '@/backoffice-common/components/profile';
import SideMenu from '@/backoffice-common/lib/side-menu';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface AppContainerProps {
	children?: React.ReactNode;
}

const AppContainer = ({ children }: AppContainerProps) => {

	const [ opened, { toggle } ] = useDisclosure();
	const isDesktop = useMediaQuery('(min-width: 48em)');

	return (
		<AppShell
			header={{ height: { base: 60 }, collapsed: isDesktop }}
			navbar={{ width: 250,  breakpoint: 'sm', collapsed: { mobile: !opened } }}
			classNames={{ main: classes.main }}
		>
			<AppShell.Header>
				<Group h='100%' px='md'>
					<Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
					<Box hiddenFrom='sm' style={{ flex: 1 }}>
						<Profile/>
					</Box>
				</Group>
			</AppShell.Header>
			<SideMenu/>
			<AppShell.Main>
				{children}
			</AppShell.Main>
		</AppShell>
	)
};

export default AppContainer;