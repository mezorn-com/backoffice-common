import * as React from 'react';
import { createStyles } from '@mantine/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FormLabel } from '@/backoffice-common/components/form/components';
import type { HtmlInput, IFormField } from '@/backoffice-common/types/form';

interface IProps {
    field: HtmlInput;
    onChange: (value: string) => void;
    value: string | undefined;
}

const useStyles = createStyles((theme) => {
    return {
        editor: {
            ' > div': {
                '&.ql-toolbar': {
                    borderTopLeftRadius: theme.radius.sm,
                    borderTopRightRadius: theme.radius.sm,
                },
                '&.ql-container': {
                    borderBottomLeftRadius: theme.radius.sm,
                    borderBottomRightRadius: theme.radius.sm,
                },
            }
        }
    }
})

const FormRTE = ({
    field,
    onChange,
    value
}: IProps) => {

    const { classes } = useStyles();

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