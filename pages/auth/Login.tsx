import { showMessage } from '@/backoffice-common/lib/notification';
import ChangePassword from '@/backoffice-common/pages/auth/ChangePassword';
import { APP_NAME } from '@/config';
import useStore from '@/store';
import {
	Box,
	Button,
	Group,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { IconAt, IconChevronRight, IconKey } from '@tabler/icons-react';
import axios from 'axios';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import classes from './Login.module.scss';

import { Lock } from '@/backoffice-common/components/icon/Lock';
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

// biome-ignore lint/correctness/noUnusedVariables: TODO: Remove
const Login = ({ right, forgotPasswordButton }: ILoginProps) => {
	const { t } = useTranslation();
	const setLoginInfo = useStore(store => store.setAuth);
	const [loginResponse, setLoginResponse] =
		React.useState<ILoginResponse | null>(null);

	const form = useForm({
		initialValues: {
			identifier: '',
			password: '',
		},
		clearInputErrorOnChange: true,
		validate: {
			identifier: hasLength(
				{ min: 6 },
				'Username must be 6 characters min',
			),
			password: hasLength(
				{ min: 6 },
				'Password must be 6 characters min',
			),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		const { data } = await axios.post<IResponse<ILoginResponse>>(
			'/login',
			values,
		);

		const { requirePasswordChange } = data.data;

		if (requirePasswordChange) {
			setLoginResponse(data.data);
		} else {
			setLoginInfo(data.data);
		}
	};

	const changePassword = async (newPassword: string) => {
		const params = {
			newPassword,
		};
		const { data } = await axios.post<IResponse<unknown>>(
			'/api/users/me/change-password',
			params,
			{
				headers: {
					authorization: `Bearer ${loginResponse?.token}`,
				},
			},
		);
		if (data.success) {
			showMessage(t('success', { ns: 'common' }), 'green');

			if (loginResponse) {
				setLoginInfo(loginResponse);
			}
		}
	};

	return (
		<div className={classes.container}>
			<div className={classes.card}>
				<Box style={{ width: '100%' }} mx='auto'>
					<form
						onSubmit={form.onSubmit(handleSubmit)}
						className={classes.form}
					>
						<div
							style={{
								width: '80px',
								aspectRatio: 1,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '100%',
								background: '#F1F3F5',
								placeSelf: 'center',
								marginBottom: '20px',
							}}
						>
							<Lock color='#8E8E8F' size={40} />
						</div>

						<Title order={2} size='h1'>
							{t('welcome', { ns: 'auth' })}!
						</Title>
						<Text c='dimmed' fz='sm' fw={500} mb='lg'>
							{t('loginDescription', { ns: 'auth' })}
						</Text>
						<TextInput
							size='lg'
							leftSection={<IconAt size={18} />}
							label={t('username', { ns: 'auth' })}
							placeholder={t('username', { ns: 'auth' })}
							styles={{
								input: {
									fontSize: 15,
								},
								label: {
									display: 'none',
								},
							}}
							mb='sm'
							{...form.getInputProps('identifier')}
						/>
						<PasswordInput
							size='lg'
							leftSection={<IconKey size={18} />}
							label={t('password', { ns: 'auth' })}
							placeholder='******'
							styles={{
								input: {
									fontSize: 15,
								},
								label: {
									display: 'none',
								},
							}}
							{...form.getInputProps('password')}
						/>

						{forgotPasswordButton}

						<Group justify='flex-end' mt='md'>
							<Button
								type='submit'
								variant='filled'
								size='lg'
								rightSection={<IconChevronRight size={18} />}
								styles={{
									label: {
										fontSize: 15,
									},
								}}
								fullWidth
							>
								{t('login', { ns: 'auth' })}
							</Button>
						</Group>
						<div className={classes.header}>
							<div>{APP_NAME}</div>
							<div className={classes.divider} />
							<div className={classes.headerText}>OFFICE</div>
							<div className={classes.version}>v1.3.5</div>
						</div>
					</form>
				</Box>
			</div>
			{/* <div
				style={{
					flex: 3,
					backgroundColor: right?.background ?? '#2ca1b9',
				}}
				className={classes.image}
			>
				{right?.children}
			</div> */}
			<ChangePassword
				opened={!!loginResponse}
				onClose={() => setLoginResponse(null)}
				onSubmit={changePassword}
			/>
		</div>
	);
};

export default Login;
