import * as React from 'react';
import { ActionIcon, Menu, createStyles, rem } from '@mantine/core';
import type { Row } from '@tanstack/react-table';
import { IconDots } from '@tabler/icons-react';
import ActionButton, { ActionButtonProps } from '@/backoffice-common/components/common/action-button';

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
	buttons: ActionButtonProps[];
	row: Row<Record<string, unknown>>;
}

const RowActionButtons = ({
	buttons,
	row
}: RowActionButtonsProps) => {
	const { classes } = useStyles();

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
					buttons.map(button => {
						return (
							<ActionButton
								key={button.actionKey}
								data={row.original}
								{...button}
							/>
						)
					})
				}
			</Menu.Dropdown>
		</Menu>
	)
}

export default RowActionButtons;