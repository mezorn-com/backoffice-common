import { SimpleGrid } from '@mantine/core';
import { path } from 'ramda';
import type { ReactNode } from 'react';

import { useRenderField } from '@/backoffice-common/hooks';
import type { IDetailPageState } from '@/backoffice-common/hooks/useDetailPage';
import { FieldType, type IFormField, RenderType } from '@/backoffice-common/types/form';

import classes from './Detail.module.scss';

interface IDetailProps {
	id: string;
	head?: ReactNode;
	state: IDetailPageState;
	apiUrl: string;
}

const Detail = ({
	// biome-ignore lint/correctness/noUnusedVariables: TODO: Remove
	// eslint-disable TODO: Remove
	// eslint-disable-next-line
	id,
	head,
	// biome-ignore lint/correctness/noUnusedVariables: TODO: Remove
	// eslint-disable-next-line
	apiUrl,
	// biome-ignore lint/correctness/noUnusedVariables: TODO: Remove
	// eslint-disable-next-line
	state: { values, details, actions }
}: IDetailProps) => {
	const renderField = useRenderField();

	const getDetailValue = (
		field: IFormField,
		detailValues: Record<string, unknown>
	): ReactNode => {
		if (field.type !== FieldType.RENDER) {
			return null;
		}
		const value = path(field.key.split('.'), detailValues);

		return renderField(field, value, detailValues);
	};

	const renderDetails = (
		renderFields: IFormField[],
		// biome-ignore lint/suspicious/noExplicitAny: TODO: fix type
		// eslint-disable-next-line
		renderValues: Record<string, any>
	) => {
		return (
			<div className={classes.group} key='group'>
				{renderFields.map(field => {
					if (field.type === FieldType.OBJECT) {
						return renderDetails(
							field.fields ?? [],
							renderValues[field.key]
						);
					}
					if (field.type === FieldType.GROUP) {
						return null;
					}
					const value = getDetailValue(field, renderValues);
					const isTable =
						field.type === FieldType.RENDER &&
						field.renderType === RenderType.TABLE;
					return (
						<SimpleGrid
							key={field.key}
							cols={isTable ? 1 : 2}
							spacing={50}
							verticalSpacing='xl'
							className={classes.grid}
						>
							<span
								className={classes.label}
								style={{
									textAlign: isTable ? 'left' : 'right'
								}}
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
