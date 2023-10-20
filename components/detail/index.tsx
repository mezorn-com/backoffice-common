import * as React from 'react';
import { path } from 'ramda';
import { Anchor, createStyles, SimpleGrid } from '@mantine/core';
import type { IFormField } from '@/backoffice-common/types/form';
import { FieldType, RenderType } from '@/backoffice-common/types/form';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { IDetailPageState } from '@/backoffice-common/hooks/useDetailPage';
import ImagePreview from '@/backoffice-common/components/common/image-preview';

interface IDetailProps {
	id: string;
	head?: React.ReactNode;
	state: IDetailPageState;
	apiUrl: string;
}

const Detail = ({ id, head, apiUrl, state: { values, details, actions } }: IDetailProps) => {
	const { classes } = useStyles();

	const getDetailValue = (field: IFormField, detailValues: Record<string, any>): React.ReactNode => {
		if (field.type !== FieldType.RENDER) {
			return null;
		}
		const value = path(field.key.split('.'), detailValues);

		switch (field.renderType) {
			case RenderType.TEXT: {
				if (typeof value === 'string' || typeof value === 'number') {
					return value;
				}
				break;
			}
			case RenderType.BOOLEAN: {
				return value ? 'Yes' : 'No';
			}
			case RenderType.LINK: {
				if (typeof value === 'string') {
					const uri: string = field.uri ?? '';
					return (
						<Anchor
							target={'_blank'}
							href={getSubResourceUrl(uri, [{ match: '{_id}', replace: values._id ?? '' }])}
						>
							{value}
						</Anchor>
					);
				}
				break;
			}
			case RenderType.TABLE: {
				return (
					<table className={classes.table}>
						<thead>
							<tr>
								{field.columns.map(column => {
									return <th key={column.key}>{column.label}</th>;
								})}
							</tr>
						</thead>
						<tbody>
							{(Array.isArray(value) ? value : []).map((row, index) => {
								return (
									<tr key={index}>
										{field.columns.map(column => {
											return <td key={`${column.key}-${index}`}>{row?.[column.key] ?? '-'}</td>;
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				);
			}
			case RenderType.IMAGE: {
				return (
					<ImagePreview
						src={value as string}
						width={'200'}
						height={'100'}
					/>
				)
			}
		}
		console.warn('Detail Unknown render type: ', field.renderType);
		return '-';
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
		table: {
			width: '100%',
			'tbody > tr > td': {
				fontWeight: 400,
			},
		},
	};
});

export default Detail;
