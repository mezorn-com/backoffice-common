import { type ComboboxItem, Select, type SelectProps } from '@mantine/core';
import { produce } from 'immer';
import { clone } from 'ramda';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import type { IReference } from '@/backoffice-common/types/api';

export interface CascadingSelectProps extends Omit<SelectProps, 'data'> {
	fetchReference?: (code: string, parent?: string) => Promise<IReference[]>;
	refCode: string;
	onChange?: (value: string | null) => void;
	error?: ReactNode;
}

const CascadingSelect = ({
	fetchReference,
	refCode,
	onChange,
	error,
	...props
}: CascadingSelectProps) => {
	const indexRef = useRef<number | null>(null);
	const [data, setData] = useState<IReference[][]>([]);
	const [values, setValues] = useState<(string | null)[]>([]);

	useEffect(() => {
		void getReference();
	}, []);

	const getReference = async (parent?: string) => {
		if (fetchReference) {
			const _data = await fetchReference(refCode ?? '', parent);
			setData(
				produce(draft => {
					if (indexRef.current === null) {
						draft.push(_data);
					} else {
						draft[indexRef.current + 1] = _data;
						const removeLength =
							draft.length - indexRef.current - 2;
						if (removeLength) {
							draft.splice(-1 * removeLength);
						}
					}
				})
			);
		} else {
			console.error('Please Provide `fetchReference` Function');
		}
	};

	const handleChange = async (value: string | null, index: number) => {
		const object = clone(data[index]).find(item => item.code === value);
		setValues(
			produce(draft => {
				draft[index] = value;
				const removeLength = draft.length - index - 1;
				if (removeLength) {
					draft.splice(-1 * removeLength);
				}
			})
		);
		if (object?.isLeaf === false) {
			indexRef.current = index;
			void getReference(object.code);
			if (onChange) {
				onChange(null);
			}
		} else if (onChange) {
			onChange(value);
		}
	};

	const formatToSelectData = (data: IReference[]): ComboboxItem[] => {
		const dataClone = clone(data);
		return dataClone.map(item => {
			return {
				value: item.code,
				label: item.name
			};
		});
	};

	const renderSelect = (): ReactNode => {
		const selects: ReactNode[] = [];
		for (const [index, datum] of data.entries()) {
			const key = `${refCode}-${index}`;
			selects.push(
				<Select
					key={key}
					{...props}
					data={formatToSelectData(datum)}
					onChange={value => handleChange(value, index)}
					value={values[index] ?? null}
					error={data.length - 1 === index ? error : !!error}
				/>
			);
		}
		return selects;
	};

	return <div>{renderSelect()}</div>;
};

export default CascadingSelect;
