import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider, LoadingOverlay } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import useStore from '../store';
import AuthRouter from './routes/AuthRouter';
import ProtectedRoutes from './routes/Protected';
import ErrorPage from '@/backoffice-common/components/common/Error';
import 'dayjs/locale/mn';
import classes from './App.module.scss';

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

	// import.meta.env.DEV && console.log('store>>>', store);

	return (
		<MantineProvider
			// withGlobalStyles
			// withNormalizeCSS
			defaultColorScheme='light'
			theme={{
				/** Controls focus ring styles. Supports the following options:
				 *  - `auto` – focus ring is displayed only when the user navigates with keyboard (default value)
				 *  - `always` – focus ring is displayed when the user navigates with keyboard and mouse
				 *  - `never` – focus ring is always hidden (not recommended)
				 */
				focusRing: 'auto',

				/** rem units scale, change if you customize font-size of `<html />` element
				 *  default value is `1` (for `100%`/`16px` font-size on `<html />`)
				 */
				// scale: number;

				/** Determines whether `font-smoothing` property should be set on the body, `true` by default */
				// fontSmoothing: boolean;

				/** White color */
				// white: string;

				/** Black color */
				// black: string;

				/** Object of colors, key is color name, value is an array of at least 10 strings (colors) */
				// colors: MantineThemeColors;

				/** Index of theme.colors[color].
				 *  Primary shade is used in all components to determine which color from theme.colors[color] should be used.
				 *  Can be either a number (0–9) or an object to specify different color shades for light and dark color schemes.
				 *  Default value `{ light: 6, dark: 8 }`
				 *
				 *  For example,
				 *  { primaryShade: 6 } // shade 6 is used both for dark and light color schemes
				 *  { primaryShade: { light: 6, dark: 7 } } // different shades for dark and light color schemes
				 * */
				// primaryShade: MantineColorShade | MantinePrimaryShade;

				/** Key of `theme.colors`, hex/rgb/hsl values are not supported.
				 *  Determines which color will be used in all components by default.
				 *  Default value – `blue`.
				 * */
				primaryColor: 'blue',

				/** Function to resolve colors based on variant.
				 *  Can be used to deeply customize how colors are applied to `Button`, `ActionIcon`, `ThemeIcon`
				 *  and other components that use colors from theme.
				 * */
				// variantColorResolver: VariantColorsResolver;

				/** font-family used in all components, system fonts by default */
				fontFamily: 'GIP',

				/** Monospace font-family, used in code and other similar components, system fonts by default  */
				// fontFamilyMonospace: string;

				/** Controls various styles of h1-h6 elements, used in TypographyStylesProvider and Title components */
				headings: {
					fontFamily: 'GIP',
					// fontWeight: string;
					// sizes: {
					// 	h1: HeadingStyle;
					// 	h2: HeadingStyle;
					// 	h3: HeadingStyle;
					// 	h4: HeadingStyle;
					// 	h5: HeadingStyle;
					// 	h6: HeadingStyle;
					// };
				},

				/** Object of values that are used to set `border-radius` in all components that support it */
				// radius: MantineRadiusValues;

				/** Key of `theme.radius` or any valid CSS value. Default `border-radius` used by most components */
				// defaultRadius: MantineRadius;

				/** Object of values that are used to set various CSS properties that control spacing between elements */
				// spacing: MantineSpacingValues;

				/** Object of values that are used to control `font-size` property in all components */
				// fontSizes: MantineFontSizesValues;

				/** Object of values that are used to control `line-height` property in `Text` component */
				// lineHeights: MantineLineHeightValues;

				/** Object of values that are used to control breakpoints in all components,
				 *  values are expected to be defined in em
				 * */
				// breakpoints: MantineBreakpointsValues;

				/** Object of values that are used to add `box-shadow` styles to components that support `shadow` prop */
				// shadows: MantineShadowsValues;

				/** Determines whether user OS settings to reduce motion should be respected, `false` by default */
				// respectReducedMotion: boolean;

				/** Determines which cursor type will be used for interactive elements
				 * - `default` – cursor that is used by native HTML elements, for example, `input[type="checkbox"]` has `cursor: default` styles
				 * - `pointer` – sets `cursor: pointer` on interactive elements that do not have these styles by default
				 */
				cursorType: 'pointer',

				/** Default gradient configuration for components that support `variant="gradient"` */
				// defaultGradient: MantineGradient;

				/** Class added to the elements that have active styles, for example, `Button` and `ActionIcon` */
				// activeClassName: string;

				/** Class added to the elements that have focus styles, for example, `Button` or `ActionIcon`.
				 *  Overrides `theme.focusRing` property.
				 */
				// focusClassName: string;

				/** Allows adding `classNames`, `styles` and `defaultProps` to any component */
				// components: MantineThemeComponents;

				/** Any other properties that you want to access with the theme objects */
				// other: MantineThemeOther;









				// focusRing: 'auto',
				// activeStyles: {
				// 	transform: 'scale(0.99)',
				// },
				// loader: 'dots',
				// cursorType: 'pointer',
				// // dateFormat: 'YYYY/MM/DD', no longer supported in v6. Use Component props instead
				// datesLocale: 'mn',
				// fontFamily: 'GIP',
				// globalStyles: () => {
				// 	return {
				// 		// Write global styles here
				// 	};
				// },
				// components: {
				// 	Button: {
				// 		defaultProps: {},
				// 		classNames: {},
				// 		styles: {},
				// 	},
				// },
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
