import * as React from 'react';
import { ActionIcon, Avatar, Flex, Menu, Title } from '@mantine/core';
import { IconSettings, IconUser } from '@tabler/icons-react';
import classes from './Profile.module.scss';
import useStore from '@/store';
import { useTranslation } from 'react-i18next';

const Profile = () => {

	const { t } = useTranslation();
	const userName = useStore(state => state.auth.name);
	const clearStore = useStore(state => state.clearStore);

	return (
		<div className={classes.container}>
			<Flex
				justify="center"
				align="center"
				direction="row"
				gap="sm"
			>
				<Avatar radius={'xl'}>
					<IconUser/>
				</Avatar>
				<Title order={6}>
					{userName}
				</Title>
			</Flex>
			<Menu shadow="md" width={200} position='bottom-end'>
				<Menu.Target>
					<ActionIcon size={'lg'} variant={'light'}>
						<IconSettings/>
					</ActionIcon>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item onClick={clearStore}>{t('logout', { ns: 'auth' })}</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	)
};

export default Profile;