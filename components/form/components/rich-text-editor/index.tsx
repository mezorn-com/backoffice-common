import 'react-quill/dist/quill.snow.css';

import Quill from 'quill';
import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
const Delta = Quill.import('delta');

import { FormLabel } from '@/backoffice-common/components/form/components';
import type { HtmlInput } from '@/backoffice-common/types/form';

import classes from './RTE.module.scss';

interface IProps {
	field: HtmlInput;
	onChange: (value: string) => void;
	value: string | undefined;
}

const FormRTE = ({ field, onChange, value }: IProps) => {
	const quillRef = useRef<ReactQuill>(null);

	useEffect(() => {
		if (quillRef.current) {
			const quill = quillRef.current.getEditor();
			
			quill.clipboard.addMatcher('pre', (node: Element) => {
				const text = node.textContent || '';
				return new Delta().insert(text, { 'code-block': true });
			});
		}
	}, []);

	return (
		<>
			<FormLabel label={field.label} withAsterisk={field.required} />
			<ReactQuill
				ref={quillRef}
				theme='snow'
				onChange={onChange}
				defaultValue={value}
				// value={value}
				className={classes.editor}
				modules={{
					toolbar: [
						[ { header: '1' }, { header: '2' }, { font: [] } ],
						[ { size: [] } ],
						[ 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block' ],
						[
							{ list: 'ordered' },
							{ list: 'bullet' },
							{ indent: '-1' },
							{ indent: '+1' }
						],
						[ 'link', 'image', 'video' ],
						[ 'clean' ]
					],
					clipboard: {
						matchVisual: false
					}
				}}
				formats={[
					'header',
					'font',
					'size',
					'bold',
					'italic',
					'underline',
					'strike',
					'blockquote',
					'list',
					'bullet',
					'indent',
					'link',
					'image',
					'video',
					'code-block'
				]}
			/>
		</>
	);
};

export default FormRTE;
