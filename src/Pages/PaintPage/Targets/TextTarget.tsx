import { Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

export type TextTargetProps = {
  x: number,
  y: number,
  isVisible: boolean,
  character: string,
  onTapped: (evt: KonvaEventObject<Event>) => void
}

export const TextTarget = (props: TextTargetProps) => {
  return (
    <Text
      text={props.character}
      fill="blue"
      fontSize={50}
      visible={props.isVisible}
      x={props.x}
      y={props.y}
      draggable={false}
      onTap={props.onTapped}
      onClick={props.onTapped}
    />
  )
}
