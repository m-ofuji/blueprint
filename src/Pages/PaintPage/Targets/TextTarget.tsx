import { Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { MAIN_COLOR } from '../../../Constants/Colors';
import { countStrLength } from '../../../Functions/CountStrLength';

export type TextTargetProps = {
  x: number,
  y: number,
  isVisible: boolean,
  character: string,
  fontSize: number,
  onTapped: (evt: KonvaEventObject<Event>) => void
}

export const TextTarget = (props: TextTargetProps) => {
  return (
    <Text
      text={props.character}
      strokeWidth={1}
      stroke='white'
      fill={MAIN_COLOR}
      fontSize={props.fontSize}
      visible={props.isVisible}
      x={props.x - (props.fontSize * (countStrLength(props.character) / 2))}
      y={props.y - props.fontSize / 2}
      draggable={false}
      onTap={props.onTapped}
      onClick={props.onTapped}
    />
  )
}
