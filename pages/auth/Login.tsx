import * as React from 'react';
import axios from 'axios';
import { useForm, hasLength } from '@mantine/form';
import { Box, TextInput, Group, Button, Title, Text, PasswordInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import useStore from '@/store';
import { IconAt, IconKey, IconChevronRight } from '@tabler/icons-react';
import { APP_NAME } from '@/config';
import ChangePassword from '@/backoffice-common/pages/auth/ChangePassword';
import { showMessage } from '@/backoffice-common/lib/notification';
import classes from './Login.module.scss';

import type { IResponse } from '@/backoffice-common/types/api';
import type { ILoginResponse } from '@/types';

interface IRightSection {
	children?: React.ReactNode;
	background?: `#${string}`;
}

interface ILoginProps {
	right?: IRightSection;
	forgotPasswordButton?: React.ReactNode;
}

const Login = ({
	right,
	forgotPasswordButton
}: ILoginProps) => {
	const { t } = useTranslation();
	const setLoginInfo = useStore(store => store.setAuth);
	const [ loginResponse, setLoginResponse ] = React.useState<ILoginResponse | null>(null);

	const form = useForm({
		initialValues: {
			identifier: '',
			password: '',
		},
		clearInputErrorOnChange: true,
		validate: {
			identifier: hasLength({ min: 6 }, 'Username must be 6 characters min'),
			password: hasLength({ min: 6 }, 'Password must be 6 characters min'),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		const { data } = await axios.post<IResponse<ILoginResponse>>('/login', values);

		const { requirePasswordChange } = data.data;

		if (requirePasswordChange) {
			setLoginResponse(data.data);
		} else {
			setLoginInfo(data.data);
		}
	};

	const changePassword = async (newPassword: string) => {
		const params = {
			newPassword
		}
		const { data } = await axios.post<IResponse<any>>(`/api/users/me/change-password`, params, {
			headers: {
				'Authorization': `Bearer ${loginResponse?.token}`,
			}
		});
		if (data.success) {
			showMessage(t('success', { ns: 'common' }), 'green');

			if (loginResponse) {
				setLoginInfo(loginResponse);
			}
		}
	}

	return (
		<div className={classes.container}>
			<div className={classes.card}>
				<Box
					style={{ maxWidth: 500 }}
					mx='auto'
				>
					<form
						onSubmit={form.onSubmit(handleSubmit)}
						className={classes.form}
					>
						<div className={classes.header}>
							<div>{APP_NAME}</div>
							<div className={classes.divider} />
							<div className={classes.headerText}>OFFICE</div>
							<div className={classes.version}>v1.3.5</div>
						</div>
						<Title
							order={2}
							size='h1'
						>
							{t('welcome', { ns: 'auth' })}!
						</Title>
						<Text
							c='dimmed'
							fz='sm'
							fw={500}
							mb={'lg'}
						>
							{t('loginDescription', { ns: 'auth' })}
						</Text>
						<TextInput
							leftSection={<IconAt size={18} />}
							label={t('username', { ns: 'auth' })}
							placeholder={t('username', { ns: 'auth' })}
							labelProps={{
								className: classes.label,
							}}
							mb={'sm'}
							{...form.getInputProps('identifier')}
						/>

						<PasswordInput
							leftSection={<IconKey size={18} />}
							label={t('password', { ns: 'auth' })}
							placeholder='******'
							labelProps={{
								className: classes.label,
							}}
							{...form.getInputProps('password')}
						/>

						{forgotPasswordButton}

						<Group
							justify='flex-end'
							mt='md'
						>
							<Button
								type='submit'
								variant='outline'
								radius='xl'
								size='md'
								rightSection={<IconChevronRight size={18} />}
							>
								{t('login', { ns: 'auth' })}
							</Button>
						</Group>
					</form>
				</Box>
			</div>
			<div
				style={{
					flex: 3,
					backgroundColor: right?.background ?? '#2ca1b9',
				}}
				className={classes.image}
			>
				{right?.children}
			</div>
			<ChangePassword
				opened={!!loginResponse}
				onClose={() => setLoginResponse(null)}
				onSubmit={changePassword}
			/>
		</div>
	);
};

export default Login;
