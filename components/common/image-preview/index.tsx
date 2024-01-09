import * as React from 'react';
import { Overlay, Image } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import classes from './ImagePreview.module.scss';

interface IImagePreviewProps {
    src: string;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
    className?: string;
    alt?: string;
    previewWidth?: string;
    previewHeight?: string;
    previewClassName?: string;
    previewStyle?: React.CSSProperties;
    textStyle?: React.CSSProperties;
    textClassName?: string;
    iconSize?: string;
    description?: string;
    radius?: string;
    previewRadius?: string;
}

const ImagePreview: React.FC<IImagePreviewProps> = ({
    src,
    width,
    height,
    style,
    className,
    alt,
    previewWidth,
    previewHeight,
    previewClassName,
    previewStyle,
    description,
    textStyle,
    textClassName,
    iconSize,
    radius,
    previewRadius,
}) => {
    const [ visible, setVisible ] = React.useState(false);

    const toggleOverlay = () => {
        setVisible(prev => !prev);
    };

    return (
        <>
            <div className={classes.container}>
                <Image
                    radius={radius || 0}
                    className={className}
                    style={{ cursor: 'pointer', ...style }}
                    width={width || 'auto'}
                    height={height || 'auto'}
                    src={src || '/img/logo-horizontal.svg'}
                    onClick={toggleOverlay}
                    alt={alt || 'Зураг'}
                />
                <div
                    onClick={toggleOverlay}
                    style={{ cursor: 'pointer' }}
                    className={classes.textContainer}
                >
                    <IconEye size={iconSize || 20} />{" "}
                    <p style={{ ...textStyle }} className={textClassName}>
                        {description || "Үзэх"}
                    </p>
                </div>
            </div>

        {
            visible && (
                <Overlay onClick={toggleOverlay} fixed={true} blur={15} center>
                    <Image
                        radius={previewRadius || 0}
                        className={previewClassName}
                        style={{ ...previewStyle }}
                        width={previewWidth || "50vh"}
                        height={previewHeight || "auto"}
                        src={src || "/img/logo-horizontal.svg"}
                        onClick={toggleOverlay}
                        alt={alt || "Зураг"}
                    />
                </Overlay>
            )
        }
        </>
    );
};

export default ImagePreview;
