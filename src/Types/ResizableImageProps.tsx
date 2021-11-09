import { SizeProps } from "./SizeProps"

export type ResizableImageProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  centerX: number;
  centerY: number;
  src: CanvasImageSource | undefined;
  x?: number;
  y?: number;
  updateSizeProps: React.Dispatch<React.SetStateAction<SizeProps>>;
}