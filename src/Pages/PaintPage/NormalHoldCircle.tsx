import { Circle } from 'react-konva';
import { forwardRef } from 'react';

export type NormalHoldCircleProps = {
  x: number,
  y: number
}

let NormalHoldCircleBase = (props: NormalHoldCircleProps, ref: any) => {
  return <Circle
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
