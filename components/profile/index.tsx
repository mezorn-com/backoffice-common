import * as React from 'react';
import { ActionIcon, Avatar, Button, Flex, Group, Menu, Title, UnstyledButton } from '@mantine/core';
import { IconArrowDown, IconChevronCompactDown, IconChevronDown, IconPower, IconSettings, IconUser } from '@tabler/icons-react';
import classes from './Profile.module.scss';
import useStore from '@/store';
import { useTranslation } from 'react-i18next';
import { useConfigItems } from '@/lib/config-items';

const Profile = ({compact = false}) => {

	const { t } = useTranslation();
	// @ts-ignore
	const { items, render } = useConfigItems();
	const userName = useStore(state => state.auth.name);
	const clearStore = useStore(state => state.clearStore);

	return (
		<div className={classes.container}>
			{/* {render()} */}
			
			<Menu shadow="md" width={200} position='bottom-end'>
				<Menu.Target>
					<Button
						fullWidth={!compact}  
						justify='space-between'
						leftSection={(
							<Group>
								<Avatar radius={'sm'} size={compact ? 30 : 44 } >
									<IconUser size={compact ? 18 : 24}/>
								</Avatar>
								<Title order={6}>
									{userName}
								</Title>
							</Group>
						)}
						rightSection={<IconChevronDown size={16}/>}
						size={compact ? 'md' : 'xl'}
						styles={{
							root: {
								padding: compact ? '5px' : '10px',
								borderBottom: '1px solid var(--mantine-color-gray-3)',
								background: 'white',
								color: 'black',
								borderRadius: 0,
								height: '65px'
							}
						}}
					>
					</Button>
					{/* <ActionIcon size={'xl'} variant={'light'} >
						<IconSettings/>
					</ActionIcon> */}
				</Menu.Target>

				<Menu.Dropdown>
					{
						items.map(item => {
							return (
								<Menu.Item key={item.key} onClick={item.onClick}>
									{item.label}
								</Menu.Item>
							)
						})
					}
					<Menu.Item onClick={clearStore}>{t('logout', { ns: 'auth' })}</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	)
};

export default Profile;