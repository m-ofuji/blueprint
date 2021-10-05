import { Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

export type NormalTargetProps = {
  x: number,
  y: number,
  isVisible: boolean,
  onTapped: (evt: KonvaEventObject<Event>) => void
}

export const NormalTarget = (props: NormalTargetProps) => {
  return (
    <Circle
      fill="#00000000"
      stroke="blue"
      radius={40}
      strokeWidth={5}
      visible={props.isVisible}
      x={props.x}
      y={props.y}
      draggable={false}
      onTap={props.onTapped}
      onClick={props.onTapped}
    />
  )
}
