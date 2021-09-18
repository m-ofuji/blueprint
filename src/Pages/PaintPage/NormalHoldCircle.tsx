import { Circle } from 'react-konva';

export type NormalHoldCircleProps = {
  key: number
}

export const NormalHoldCircle = (props: NormalHoldCircleProps) => {
  return <Circle
    key={props.key}
    fill="#00000000"
    stroke="yellow"
    radius={40}
    strokeWidth={5}
    x={window.innerWidth / 2}
    y={(window.innerHeight / 2) - 100}
    draggable={false}
  />
}