import * as React from 'react';
import { ActionIcon, Menu, createStyles, rem } from '@mantine/core';
import type { IRowActionButton } from '@/backoffice-common/hooks/useListPage';
import type { Row } from '@tanstack/react-table';
import { IconDots } from '@tabler/icons-react';

const useStyles = createStyles((theme) => {
	return {
		dropdown: {
			'> div:only-child': {
				display: 'flex',
				flexDirection: 'column',
				gap: rem(3)
			}
		},
		item: {
			padding: 0
		}
	}
})

interface RowActionButtonsProps {
	buttons: IRowActionButton[];
	row: Row<Record<string, unknown>>;
}

const RowActionButtons = ({
	buttons,
	row
}: RowActionButtonsProps) => {
	const { classes } = useStyles();

	const renderActionButton = (actionButton: IRowActionButton, index: number) => {
		if (actionButton.visibility) {
			if ('hasValue' in actionButton.visibility) {
				if (!row.original[actionButton.visibility.key]) {
					return null;
				}
			}
			if ('value' in actionButton.visibility) {
				if (row.original[actionButton.visibility.key] !== actionButton.visibility.value) {
					return null;
				}
			}
			if ('valueNotEquals' in actionButton.visibility) {
				if (row.original[actionButton.visibility.key] === actionButton.visibility.valueNotEquals) {
					return null;
				}
			}
		}
		const label = typeof actionButton.label === 'function' ? actionButton.label(row.original) : (actionButton.label ?? null);
		return (
			<Menu.Item
				component='div'
				key={`action-button-${index}`}
				onClick={() => actionButton.onClick?.(row.original)}
				className={classes.item}
			>
				{label}
			</Menu.Item>
		)
	}

	return (
		<Menu shadow='md' position='bottom-end'>
			<Menu.Target>
				<ActionIcon
					variant='filled'
					size='sm'
					color='primary'
				>
					<IconDots size={18}/>
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown className={classes.dropdown}>
				{
					buttons.map((actionButton, index) => renderActionButton(actionButton, index))
				}
			</Menu.Dropdown>
		</Menu>
	)
}

export default RowActionButtons;