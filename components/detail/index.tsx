import * as React from 'react';
import { path } from 'ramda';
import { SimpleGrid } from '@mantine/core';
import type { IFormField } from '@/backoffice-common/types/form';
import { FieldType, RenderType } from '@/backoffice-common/types/form';
import { IDetailPageState } from '@/backoffice-common/hooks/useDetailPage';
import { useRenderField } from '@/backoffice-common/hooks';
import classes from './Detail.module.scss';

interface IDetailProps {
	id: string;
	head?: React.ReactNode;
	state: IDetailPageState;
	apiUrl: string;
}

const Detail = ({ id, head, apiUrl, state: { values, details, actions } }: IDetailProps) => {
	const renderField = useRenderField();

	const getDetailValue = (field: IFormField, detailValues: Record<string, any>): React.ReactNode => {
		if (field.type !== FieldType.RENDER) {
			return null;
		}
		const value = path(field.key.split('.'), detailValues);

		return renderField(field, value, detailValues);
	};

	const renderDetails = (renderFields: IFormField[], renderValues: Record<string, any>) => {
		return (
			<div
				className={classes.group}
				key='group'
			>
				{renderFields.map(field => {
					if (field.type === FieldType.OBJECT) {
						return renderDetails(field.fields ?? [], renderValues[field.key]);
					}
					if (field.type === FieldType.GROUP) {
						return null;
					}
					const value = getDetailValue(field, renderValues);
					const isTable = field.type === FieldType.RENDER && field.renderType === RenderType.TABLE;
					return (
						<SimpleGrid
							key={field.key}
							cols={isTable ? 1 : 2}
							spacing={50}
							verticalSpacing={'xl'}
							className={classes.grid}
						>
							<span
								className={classes.label}
								style={{ textAlign: isTable ? 'left' : 'right' }}
							>
								{field.label}
							</span>
							<span className={classes.value}>{value}</span>
						</SimpleGrid>
					);
				})}
			</div>
		);
	};

	return (
		<div className={classes.container}>
			<div>{head}</div>
			{renderDetails(details, values)}
		</div>
	);
};

export default Detail;
