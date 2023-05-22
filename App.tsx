import * as React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import { MantineProvider, LoadingOverlay } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import useStore from '../store';
import AuthRoutes from './routes/Auth';
import ProtectedRoutes from './routes/Protected';
import 'dayjs/locale/mn';

const authRoutes = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path={'*'}
			element={<AuthRoutes />}
		/>
	)
);

const protectedRoutes = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path={'*'}
			element={<ProtectedRoutes />}
		/>
	)
);

function App() {
	const token = useStore(state => state.auth.token);
	const loading = useStore(state => state.loading);
	const setLoading = useStore(state => state.setLoading);
	const store = useStore();

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
			<ModalsProvider>
				<RouterProvider router={token ? protectedRoutes : authRoutes} />
			</ModalsProvider>
			<LoadingOverlay visible={loading}/>
		</MantineProvider>
	);
}

export default App;
