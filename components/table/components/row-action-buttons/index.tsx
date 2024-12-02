import ActionButton, {
	type ActionButtonProps,
} from '@/backoffice-common/components/common/action-button';
import { ActionIcon, Menu } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import type { Row } from '@tanstack/react-table';
import classes from './RowActionButton.module.scss';

interface RowActionButtonsProps {
	buttons: ActionButtonProps[];
	row: Row<Record<string, unknown>>;
}

const RowActionButtons = ({ buttons, row }: RowActionButtonsProps) => {
	return (
		<Menu shadow='md' position='bottom-end'>
			<Menu.Target>
				<ActionIcon variant='subtle' size='sm'>
					<IconDots size={18} />
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown className={classes.dropdown}>
				{buttons.map(button => {
					return (
						<ActionButton
							isFormAction
							key={button.actionKey}
							data={row.original}
							{...button}
						/>
					);
				})}
			</Menu.Dropdown>
		</Menu>
	);
};

export default RowActionButtons;
