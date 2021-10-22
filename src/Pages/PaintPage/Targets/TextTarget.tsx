import { Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { StampTextSize } from '../Constants';

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
      strokeWidth={1}
      stroke='white'
      fill='#0f47ff'
      fontSize={StampTextSize}
      visible={props.isVisible}
      x={props.x - (StampTextSize * props.character.length) / 2}
      y={props.y - StampTextSize / 2}
      draggable={false}
      onTap={props.onTapped}
      onClick={props.onTapped}
    />
  )
}
