// import { Circle } from 'konva/lib/shapes/Circle';
// import { LegacyRef } from 'react';
import { Circle } from 'react-konva';

export type NormalHoldCircleProps = {
  x: number,
  y: number
}

export const NormalHoldCircle = (ref:any, props: NormalHoldCircleProps) => {
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