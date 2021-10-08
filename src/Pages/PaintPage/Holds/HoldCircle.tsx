import { Circle } from 'react-konva';
import { forwardRef } from 'react';

export type HoldCircleProps = {
  x: number,
  y: number,
  scale: number | undefined,
  color: string
}

let HoldCircleBase = (props: HoldCircleProps, ref: any) => {
  return <Circle
    scaleX={props.scale}
    scaleY={props.scale}
    ref={ref}  
    fill="#00000000"
    stroke={props.color}
    radius={40}
    strokeWidth={5}
    x={props.x}
    y={props.y}
    draggable={false}
  />
}

export const HoldCircle = forwardRef(HoldCircleBase)
