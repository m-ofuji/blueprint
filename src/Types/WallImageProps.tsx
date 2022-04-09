import { SizeProps } from "./SizeProps"
import { HoldCircleProps } from "../Pages/PaintPage/Holds/HoldCircle";
import { HoldTextProps } from "../Pages/PaintPage/Holds/HoldText";

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