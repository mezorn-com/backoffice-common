import { Anchor, Stack } from '@mantine/core';
import { IconCircleCheckFilled, IconCircleXFilled } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import ImagePreview from '@/backoffice-common/components/common/image-preview';
import {
	FieldType,
	type IFormField,
	RenderType
} from '@/backoffice-common/types/form';
import { replacePathParameters } from '@/backoffice-common/utils';

export const useRenderField = () => {
	return (
		field: IFormField,
		value: unknown,
		// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
		// eslint-disable-next-line
		data: Record<string, any>
	): ReactNode => {
		if (field.type !== FieldType.RENDER) {
			return null;
		}
		switch (field.renderType) {
			case RenderType.TEXT: {
				if (typeof value === 'string' || typeof value === 'number') {
					return value;
				}
				break;
			}
			case RenderType.BOOLEAN: {
				let icon: ReactNode = undefined;
				if (value === true) {
					icon = (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								color: 'lightgreen'
							}}
						>
							<IconCircleCheckFilled size={20} />
						</div>
					);
				}
				if (value === false) {
					icon = (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								color: 'lightgray'
							}}
						>
							<IconCircleXFilled size={20} />
						</div>
					);
				}
				return icon;
			}
			case RenderType.LINK: {
				if (typeof value === 'string') {
					const uri: string = field.uri ?? '';
					return (
						<Anchor
							target='_blank'
							href={replacePathParameters(uri, data)}
						>
							{value}
						</Anchor>
					);
				}
				break;
			}
			case RenderType.TABLE: {
				return (
					<table style={{ width: '100%' }}>
						<thead>
							<tr>
								{field.columns.map(column => {
									return (
										<th key={column.key}>{column.label}</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{(Array.isArray(value) ? value : []).map(
								(row, index) => {
									return (
										// biome-ignore lint/suspicious/noArrayIndexKey: TODO: use index
										<tr key={index}>
											{field.columns.map(column => {
												return (
													<td
														key={`${column.key}-${index}`}
														style={{
															fontWeight: 400
														}}
													>
														{row?.[column.key] ??
															'-'}
													</td>
												);
											})}
										</tr>
									);
								}
							)}
						</tbody>
					</table>
				);
			}
			case RenderType.IMAGE: {
				if (Array.isArray(value)) {
					return (
						<Stack gap='xs'>
							{value.map((src, index) => {
								return (
									<ImagePreview
										// biome-ignore lint/suspicious/noArrayIndexKey: TODO: optimize later
										key={index}
										src={src}
										width='200'
										height='100'
									/>
								);
							})}
						</Stack>
					);
				}
				return (
					<ImagePreview
						src={value as string}
						width='200'
						height='100'
					/>
				);
			}
			default: {
				// @ts-expect-error happens rarely
				console.warn(`Unknown render type "${field.renderType}"`);
				return '-';
			}
		}
		return null;
	};
};
