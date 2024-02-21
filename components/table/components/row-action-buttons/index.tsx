import * as React from 'react';
import { ActionIcon, Menu, rem } from '@mantine/core';
import type { Row } from '@tanstack/react-table';
import { IconDots } from '@tabler/icons-react';
import ActionButton, { type ActionButtonProps } from '@/backoffice-common/components/common/action-button';
import classes from './RowActionButton.module.scss';

interface RowActionButtonsProps {
	buttons: ActionButtonProps[];
	row: Row<Record<string, unknown>>;
	callback: () => void;
}

const RowActionButtons = ({
	buttons,
	row,
	callback
}: RowActionButtonsProps) => {
	return (
		<Menu shadow='md' position='bottom-end'>
			<Menu.Target>
				<ActionIcon
					variant='filled'
					size='sm'
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