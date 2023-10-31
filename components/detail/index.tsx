import * as React from 'react';
import { path } from 'ramda';
import { Anchor, createStyles, Flex, SimpleGrid } from '@mantine/core';
import type { IFormField } from '@/backoffice-common/types/form';
import { FieldType, RenderType } from '@/backoffice-common/types/form';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { IDetailPageState } from '@/backoffice-common/hooks/useDetailPage';
import { useRenderField } from '@/backoffice-common/hooks';

interface IDetailProps {
	id: string;
	head?: React.ReactNode;
	state: IDetailPageState;
	apiUrl: string;
}

const Detail = ({ id, head, apiUrl, state: { values, details, actions } }: IDetailProps) => {
	const { classes } = useStyles();
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

const useStyles = createStyles(theme => {
	return {
		grid: {
			borderBottom: `1px solid ${theme.colors.gray[1]}`,
			marginTop: theme.spacing.sm,
		},
		label: {
			textAlign: 'right',
			fontWeight: 700,
			color: theme.colors.gray[6],
			fontSize: 12,
			textTransform: 'uppercase',
		},
		value: {
			fontWeight: 600,
			textAlign: 'left',
		},
		container: {
			borderRadius: theme.radius.lg,
			padding: '20px',
			border: `1px solid ${theme.colors.gray[2]}`,
			margin: '1rem',
		},
		group: {
			borderWidth: 1,
			borderStyle: 'solid',
			borderColor: theme.colors.gray[1],
			borderRadius: theme.radius.md,
			marginTop: theme.spacing.md,
			marginBottom: theme.spacing.md,
			padding: theme.spacing.md,
		},
	};
});

export default Detail;
