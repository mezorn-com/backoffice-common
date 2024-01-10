import * as React from 'react';
import { FileInput, type FileInputProps, Image } from '@mantine/core';
import classes from './FileUpload.module.scss';

interface FileUploadProps extends Omit<FileInputProps, 'value'> {
    value: string | File | null | undefined;
}

const IMAGE_MIME_TYPES = [ 'image/png', 'image/gif', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/avif' ];

const FileUpload = ({
    value,
    ...props
}: FileUploadProps) => {
    const previewFile = (): React.ReactNode => {
        if (!value) {
            return null;
        }
        if (value instanceof File && IMAGE_MIME_TYPES.includes(value.type)) {
            const src = URL.createObjectURL(value)
            return (
                <Image
                    src={src}
                    onLoad={() => {
                        URL.revokeObjectURL(src);
                    }}
                />
            )
        }
        if (typeof value === 'string') {
            return (
                <Image
                    className={classes.image}
                    src={value}
                    onError={() => {
                        console.log('ERROR>>>>')
                    }}
                    onLoad={(event) => {
                        event.currentTarget.style.display = 'block';
                    }}
                    alt=''
                />
            )
        }
        return null;
    }
    return (
        <div>
            <FileInput
                {...props}
                mb='xs'
                // @ts-expect-error
                placeholder='Хуулах...'
            />
            {previewFile()}
        </div>
    )
};

export default FileUpload;