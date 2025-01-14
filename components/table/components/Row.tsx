import { useForceUpdate } from '@mantine/hooks';
import { clsx } from 'clsx';
import * as React from 'react';

import { TableContext } from '../context';
import { RowGroup } from '../types';
import { ROW_UID_ATTR } from '../utils';
import classes from './Row.module.scss';

interface TableRowProps {
	children: React.ReactNode;
	rowId: string;
	rowGroup: RowGroup;
	rowIndex: number;
}

const TableRow = ({ children, rowId, rowGroup, rowIndex }: TableRowProps) => {
	const rowRef = React.useRef<HTMLDivElement>(null);
	const forceUpdate = useForceUpdate();
	const { setRowHoverIndex, rowHoverIndex } = React.useContext(TableContext);

	// biome-ignore lint/correctness/useExhaustiveDependencies: TODO: Figure this out later
	React.useEffect(() => {
		if (rowRef.current) {
			forceUpdate();
		}
	}, [ rowRef.current ]);

	const renderCell = () => {
		if (!rowRef.current) {
			return null;
		}
		return children;
	};

	const customAttrs = {
		[ROW_UID_ATTR]: rowId
	};

	return (
		<div
			{...customAttrs}
			className={clsx(classes.container, {
				[classes.hover]:
					rowGroup === RowGroup.BODY && rowIndex === rowHoverIndex
			})}
			ref={rowRef}
			onMouseEnter={() => {
				switch (rowGroup) {
					case RowGroup.BODY: {
						setRowHoverIndex(rowIndex);
						break;
					}
					case RowGroup.HEADER:
					case RowGroup.FOOTER: {
						setRowHoverIndex(null);
						break;
					}
					default: {
						return;
					}
				}
			}}
		>
			{renderCell()}
		</div>
	);
};

export default TableRow;
