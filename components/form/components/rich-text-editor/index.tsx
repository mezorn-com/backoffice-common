import * as React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from '@/backoffice-common/components/form/components';
import type { HtmlInput } from '@/backoffice-common/types/form';
import classes from './RTE.module.scss';

interface IProps {
    field: HtmlInput;
    onChange: (value: string) => void;
    value: string | undefined;
}

const FormRTE = ({
    field,
    onChange,
    value
}: IProps) => {

    return (
        <>
            <FormLabel
                label={field.label}
                withAsterisk={field.required}
            />
            <ReactQuill
                theme={'snow'}
                onChange={onChange}
                value={value}
                className={classes.editor}
                modules={{
                    toolbar: [
                        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                        [{size: []}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'},
                            {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    clipboard: {
                        // toggle to add extra line breaks when pasting HTML:
                        matchVisual: false,
                    }
                }}
                formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image', 'video'
                ]}
            />
        </>
    )
}

export default FormRTE;