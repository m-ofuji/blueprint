import { SizeProps } from "./SizeProps"

export type WallImageProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  centerX: number;
  centerY: number;
  x?: number;
  y?: number;
  src: CanvasImageSource | undefined;
  imageRotation?: number,
  imageX?: number,
  imageY?: number,
  updateSizeProps: React.Dispatch<React.SetStateAction<SizeProps>>;
}