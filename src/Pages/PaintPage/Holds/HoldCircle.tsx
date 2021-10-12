import { Circle } from 'react-konva';
import { forwardRef } from 'react';

export type HoldCircleProps = {
  x: number,
  y: number,
  scale: number | undefined,
  color: string
}

export const isHoldCircleProps = (arg: unknown): arg is HoldCircleProps =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as HoldCircleProps).x === 'number' &&
    typeof (arg as HoldCircleProps).y === 'number' &&
    (typeof (arg as HoldCircleProps).scale === 'number' || (arg as HoldCircleProps).scale === undefined) &&
    typeof (arg as HoldCircleProps).color === 'string';

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
