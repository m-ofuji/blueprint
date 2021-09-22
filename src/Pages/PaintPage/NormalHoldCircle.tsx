// import { Circle } from 'konva/lib/shapes/Circle';
// import { LegacyRef } from 'react';
import { Circle } from 'react-konva';
import { forwardRef } from 'react';

export type NormalHoldCircleProps = {
  // key:number,
  x: number,
  y: number
}

// export const NormalHoldCircle = (props: NormalHoldCircleProps) => {
let NormalHoldCircleBase = (props : NormalHoldCircleProps, ref : any) => {
  return <Circle
    ref={ref}  
  // key={props.key}
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
