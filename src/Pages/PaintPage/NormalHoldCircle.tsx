import { Circle } from 'react-konva';
import { forwardRef } from 'react';

export type NormalHoldCircleProps = {
  x: number,
  y: number,
  scale: number | undefined
}

let NormalHoldCircleBase = (props: NormalHoldCircleProps, ref: any) => {
  return <Circle
    scaleX={props.scale}
    scaleY={props.scale}
    ref={ref}  
    fill="#00000000"
    stroke="yellow"
    radius={40}
    strokeWidth={5}
    x={props.x}
    y={props.y}
    draggable={false}
  />
}

export const NormalHoldCircle = forwardRef(NormalHoldCircleBase)
