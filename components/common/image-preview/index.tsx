import { useState } from "react";
import { Overlay, Image, createStyles } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";

const useStyles = createStyles(() => {
  return {
    imgContainer: {
      position: "relative",
      width: "fit-content",
      height: "fit-content",

      "&:hover": {
        "& img": {
          filter: "brightness(0.5)",
        },
        "& div.textContainer": {
          display: "flex",
        },
      },
      "& img": {
        transition: "all .8s ease",
      },
      "& div.textContainer": {
        margin: "0",
        position: "absolute",
        display: "none",
        gap: "0.2rem",
        alignItems: "center",
        color: "white",
        fontSize: "medium",
        zIndex: 2,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        transition: "all .8s ease",
      },
    },
  };
});

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
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.imgContainer}>
        <Image
          radius={radius || 0}
          className={className}
          style={{ cursor: "pointer", ...style }}
          width={width || "auto"}
          height={height || "auto"}
          src={src || "/img/logo-horizontal.svg"}
          onClick={toggleOverlay}
          alt={alt || "Зураг"}
        />
        <div
          onClick={toggleOverlay}
          style={{ cursor: "pointer" }}
          className={`textContainer`}
        >
          <IconEye size={iconSize || 20} />{" "}
          <p style={{ ...textStyle }} className={textClassName}>
            {description || "Үзэх"}
          </p>
        </div>
      </div>

      {visible && (
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
      )}
    </>
  );
};

export default ImagePreview;
