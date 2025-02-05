import { Avatar, Button, Menu, Title } from '@mantine/core';
import { IconChevronDown, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useConfigItems } from '@/lib/config-items';
import useStore from '@/store';

import classes from './Profile.module.scss';

const Profile = ({ compact = false, collapse = true }) => {
	const { t } = useTranslation();
	const { items, render } = useConfigItems();
	const userName = useStore(state => state.auth.name);
	const clearStore = useStore(state => state.clearStore);

	return (
		<div className={classes.container}>
			{render()}

			<Menu shadow='md' width={200} position='bottom-end'>
				<Menu.Target>
					<Button
						fullWidth={!compact}
						justify='space-between'
						leftSection={
							collapse && (
								<Avatar radius='sm' size={compact ? 30 : 44}>
									<IconUser size={compact ? 18 : 24} />
								</Avatar>
							)
						}
						rightSection={collapse ? <IconChevronDown size={16} /> : undefined}
						size={compact ? 'md' : 'xl'}
						styles={{
							root: {
								padding: compact ? '5px' : '10px',
								border: '1px solid var(--mantine-color-gray-3)',
								background: 'white',
								color: 'black'
							}
						}}
					>
						{collapse ? <Title order={6}>{userName}</Title> : (
							<Avatar radius='sm' size={compact ? 30 : 44}>
								<IconUser size={compact ? 18 : 24} />
							</Avatar>
						)}
					</Button>
					{/* <ActionIcon size={'xl'} variant={'light'} >
						<IconSettings/>
					</ActionIcon> */}
				</Menu.Target>

				<Menu.Dropdown>
					{items.map(item => {
						return (
							<Menu.Item key={item.key} onClick={item.onClick}>
								{item.label}
							</Menu.Item>
						);
					})}
					<Menu.Item onClick={clearStore}>
						{t('logout', { ns: 'auth' })}
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	);
};

export default Profile;
