import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider, LoadingOverlay, createStyles } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import useStore from '../store';
import AuthRouter from './routes/AuthRouter';
import ProtectedRoutes from './routes/Protected';
import ErrorPage from '@/backoffice-common/components/common/Error';
import 'dayjs/locale/mn';

const authRoutes = createBrowserRouter([
		{
			path: '*',
			element: <AuthRouter/>,
			errorElement: <ErrorPage/>
		}
	]
);

const protectedRoutes = createBrowserRouter([
		{
			path: '*',
			element: <ProtectedRoutes/>,
			errorElement: <ErrorPage/>,
		}
	]
);

const useStyles = createStyles((theme) => {
	return {
		modalHeader: {
			borderBottom: `1px solid ${theme.colors.gray[3]}`,
		}
	}
})

function App() {
	const token = useStore(state => state.auth.token);
	const loading = useStore(state => state.loading);
	const setLoading = useStore(state => state.setLoading);
	const store = useStore();

	const { classes } = useStyles();

	React.useEffect(() => {
		if (loading) {
			// To prevent app booting with 'loading' on.
			setLoading(false);
		}
	}, []);

	import.meta.env.DEV && console.log('store>>>', store);

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'light',
				focusRing: 'auto',
				activeStyles: {
					transform: 'scale(0.99)',
				},
				loader: 'dots',
				cursorType: 'pointer',
				// dateFormat: 'YYYY/MM/DD', no longer supported in v6. Use Component props instead
				datesLocale: 'mn',
				fontFamily: 'GIP',
				globalStyles: () => {
					return {
						// Write global styles here
					};
				},
				components: {
					Button: {
						defaultProps: {},
						classNames: {},
						styles: {},
					},
				},
			}}
		>
			<Notifications
				autoClose={20_000}
				position={'top-right'}
			/>
			<ModalsProvider
				modalProps={{
					classNames: {
						header: classes.modalHeader
					},
					styles: {
						title: {
							fontWeight: 600
						}
					}
				}}
			>
				<RouterProvider router={token ? protectedRoutes : authRoutes} />
			</ModalsProvider>
			<LoadingOverlay visible={loading}/>
		</MantineProvider>
	);
}

export default App;
