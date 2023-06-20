import * as React from 'react';
import axios from 'axios';
import { useForm, hasLength } from '@mantine/form';
import { Box, TextInput, Group, Button, Title, createStyles, Text, PasswordInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import useStore from '@/store';
import { IconAt, IconKey, IconChevronRight } from '@tabler/icons-react';
import { PROJECT_TITLE } from '@/config';
import ChangePassword from '@/backoffice-common/pages/auth/ChangePassword';
import { showMessage } from '@/backoffice-common/lib/notification';

import type { IResponse } from '@/backoffice-common/types/api';
import type { ILoginResponse } from '@/types';

const Login = () => {
	const { t } = useTranslation();
	const { classes } = useStyles();

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
					sx={{ maxWidth: 500 }}
					mx='auto'
				>
					<form
						onSubmit={form.onSubmit(handleSubmit)}
						className={classes.form}
					>
						<div className={classes.header}>
							<div>{PROJECT_TITLE}</div>
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
							icon={<IconAt size={18} />}
							label={t('username', { ns: 'auth' })}
							placeholder={t('username', { ns: 'auth' })}
							labelProps={{
								className: classes.label,
							}}
							mb={'sm'}
							{...form.getInputProps('identifier')}
						/>

						<PasswordInput
							icon={<IconKey size={18} />}
							label={t('password', { ns: 'auth' })}
							placeholder='******'
							labelProps={{
								className: classes.label,
							}}
							{...form.getInputProps('password')}
						/>

						<Group
							position='right'
							mt='md'
						>
							<Button
								type='submit'
								variant='outline'
								radius='xl'
								size='md'
								rightIcon={<IconChevronRight size={18} />}
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
					backgroundColor: '#2ca1b9',
				}}
				className={classes.image}
			/>
			<ChangePassword
				opened={!!loginResponse}
				onClose={() => setLoginResponse(null)}
				onSubmit={changePassword}
			/>
		</div>
	);
};

const useStyles = createStyles(() => {
	return {
		container: {
			display: 'flex',
			height: '100%',
			backgroundColor: 'white',
			flexDirection: 'row'
		},
		card: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 500,
		},
		image: {
			backgroundSize: 'cover',
			backgroundPosition: '50% 50%',
			minHeight: '100%'
		},
		form: {
			width: 350,
			display: 'flex',
			flexDirection: 'column',
			gap: '0.5rem',
		},
		header: {
			display: 'flex',
			gap: '1rem',
			alignItems: 'center',
		},
		headerText: {
			fontWeight: 500,
			fontSize: 16,
		},
		divider: {
			borderRight: '1px solid black',
			alignSelf: 'stretch',
		},
		version: {
			borderRadius: '15px',
			background: '#F1F3F5',
			padding: '.3rem .8rem',
			fontSize: 12,
			color: '#8E8E8F',
			fontWeight: 600,
		},
		label: {
			fontWeight: 600,
			fontSize: 16,
		},
	};
});

export default Login;
