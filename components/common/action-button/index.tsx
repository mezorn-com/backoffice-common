import * as React from 'react';
import type { ListActionKey, ListItemActionKey, ItemAction } from '@/backoffice-common/types/api/meta';
import { actionColors } from '@/backoffice-common/utils/styles';
import { OpenConfirmModal } from '@mantine/modals/lib/context';
import type { TablerIconsProps } from '@tabler/icons-react';
import axios from 'axios';
import type { IResponse } from '@/backoffice-common/types/api';
import { showMessage } from '@/backoffice-common/lib/notification';
import Form from '@/backoffice-common/components/form/Form';
import { ActionIcon, Button, Drawer, useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import * as icons from '@/lib/icons/common';
import { replacePathParameters } from '@/backoffice-common/utils';
import { useConfirmModal, usePathParameter } from '@/backoffice-common/hooks';
import { last } from 'ramda';

export interface ActionButtonProps {
	data?: Record<string, unknown>;
	actionKey: ListActionKey | ListItemActionKey;
	action: ItemAction;
	onClick?: (data?: Record<string, unknown>) => void;
}

const ICON_SIZE = 16;

const ActionButton = ({
	data,
	actionKey,
	action,
	onClick
}: ActionButtonProps) => {

	const theme = useMantineTheme();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const pathParameter = usePathParameter();
	const confirmModal = useConfirmModal();

	const [ showDrawer, setShowDrawer ] = React.useState(false);

	const primaryShade: number = typeof theme.primaryShade !== 'number' ? theme.primaryShade.light : theme.primaryShade;

	const { icon, label, handler, color } = React.useMemo(() => {
		const actionColor = actionColors?.[actionKey] || 'blue';

		// const color = theme.colors[actionColor][primaryShade];
		const color = actionColor;
		let icon: React.ReactNode;
		let label: React.ReactNode;
		let actionFn: undefined | ((formValues?: Record<string, unknown>) => void);
		let confirm: (Pick<OpenConfirmModal, 'children' | 'title' | 'labels' | 'confirmProps'>) | null = null;
		// TODO: Need to implement merging........

		switch(actionKey) {
			case 'create': {
				icon = 'FilePlus';
				label = t('create', { ns: 'common' });
				actionFn = () => {
					navigate(`${pathname}/new`);
				}
				break;
			}
			case 'get': {
				label = 'Харах';
				icon = 'Eye';
				actionFn = () => {
					if (data) {
						let detailPath: string;
						const { _id } = data;
						if (pathname.endsWith('/')) {
							detailPath = `${pathname}${_id}`
						} else {
							detailPath = `${pathname}/${_id}`
						}
						navigate(detailPath);
					}
				}
				break;
			}
			case 'update': {
				label = 'Засах';
				icon = 'Edit';

				actionFn = () => {
					if (data) {
						let editPath: string;
						const { _id } = data;
						const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
						const currentPathParts = currentPath.split('/');
						if (_id && last(currentPathParts) === _id) {
							editPath = `${pathname}/edit`;
						} else {
							editPath = `${pathname}/${_id}/edit`;
						}
						navigate(editPath);
					}
				}
				break;
			}
			case 'delete': {
				label = 'Устгах';
				icon = 'Trash';

				confirm = {
					title: t('delete.modalTitle', { ns: 'common' }),
					children: t('delete.description', { ns: 'common' }),
					labels: {
						confirm: t('delete.title', { ns: 'common' }),
						cancel: t('cancel', { ns: 'common' })
					},
					confirmProps: {
						color: 'red'
					}
				}

				actionFn = async () => {
					if (data) {
						let deletePath: string;
						const { _id } = data;
						const currentPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
						const currentPathParts = currentPath.split('/');
						if (_id && last(currentPathParts) === _id) {
							deletePath = `${pathname}`;
						} else {
							deletePath = `${pathname}/${_id}`;
						}

						const { data: responseData } = await axios.delete<IResponse<any>>(`/api${deletePath}`);
						if (responseData.success) {
							showMessage(t('success', { ns: 'common' }), 'green');
							// TODO: update logic
							// void fetchData();
						}
					}
				}
				break;
			}
		}
		icon = action !== true ? (action.icon?.value ?? icon) : icon;
		label = action !== true ? (action.label ?? label) : label;
		if (action !== true && action.confirmation) {
			confirm = {
				title: 'Confirmation Modal',
				children: action.confirmation.dialogText,
				labels: {
					confirm: action.confirmation.buttonText ?? 'Confirm',
					cancel: t('cancel', { ns: 'common' })
				},
				confirmProps: {
					color: actionKey === 'delete' ? 'red' : 'blue'
				}
			}
		}
		if (action !== true && action.api) {
			actionFn = async (formValues) => {
				if (action.api?.form && !showDrawer) {
					setShowDrawer(true);
				} else {
					const { data: responseData } = await axios<IResponse<unknown>>({
						url: replacePathParameters(action.api?.uri ?? '', { ...pathParameter, ...data }),
						method: action.api?.method,
						data: formValues
					});
					if (responseData.success) {
						showMessage(t('success', { ns: 'common' }), 'green');
						setShowDrawer(false);
						// TODO: update logic
						// void fetchData();
					}
				}
			}
		}
		const handler = onClick
		?	() => {
			onClick(data);
		}
		: (formValues?: Record<string, unknown>) => {
			if (confirm) {
				confirmModal({
					...confirm,
					onConfirm() {
						actionFn?.(formValues)
					}
				})
			} else {
				actionFn?.(formValues);
			}
		}
		return {
			icon,
			label,
			color,
			handler
		}
	}, [ t, navigate, pathname, action, data, pathParameter, setShowDrawer, showDrawer, confirmModal, onClick ]);

	let Icon: ((props: TablerIconsProps) => JSX.Element) | undefined = undefined;
	if (icon) {
		// @ts-expect-error
		if (!icons?.['Icon' + icon]) {
			console.warn(`Icon not found: ${icon}`);
		} else {
			// @ts-expect-error
			Icon = icon ? icons?.['Icon' + icon] : undefined;
		}
	}

	const getButton = () => {
		if (Icon && !label) {
			return (
				<ActionIcon onClick={() => handler()} color={color}>
					<Icon size={ICON_SIZE}/>
				</ActionIcon>
			)
		}

		return (
			<Button
				size='compact-md'
				variant='light'
				leftSection={Icon ? <Icon size={ICON_SIZE} color={theme.colors[color][primaryShade]}/> : undefined}
				onClick={() => handler()}
				color={color}
			>
				{label}
			</Button>
		)
	}

	if (action !== true && action.condition) {
		if ('hasValue' in action.condition) {
			if (!data?.[action.condition.key]) {
				return null;
			}
		}
		if ('value' in action.condition) {
			if (data?.[action.condition.key] !== action.condition.value) {
				return null;
			}
		}
		if ('valueNotEquals' in action.condition) {
			if (data?.[action.condition.key] === action.condition.valueNotEquals) {
				return null;
			}
		}
	}

	return (
		<>
			{getButton()}
			{
				<Drawer
					opened={showDrawer}
					onClose={() => setShowDrawer(false)}
					position='right'
				>
					{
						showDrawer && (
							<Form
								fields={action === true ? [] : (action.api?.form?.fields ?? [])}
								onSubmit={handler}
							/>
						)
					}
				</Drawer>
			}
		</>
	)

};

export default ActionButton;