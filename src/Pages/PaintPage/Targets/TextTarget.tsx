import { Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { StampTextSize } from '../Constants';
import { MAIN_COLOR } from '../../../Constants/Colors';
import { countStrLength } from '../../../Functions/CountStrLength';

export type TextTargetProps = {
  x: number,
  y: number,
  isVisible: boolean,
  character: string,
  onTapped: (evt: KonvaEventObject<Event>) => void
}

export const TextTarget = (props: TextTargetProps) => {
  console.log(props.character.length);
  return (
    <Text
      text={props.character}
      strokeWidth={1}
      stroke='white'
      fill={MAIN_COLOR}
      fontSize={StampTextSize}
      visible={props.isVisible}
      x={props.x - (StampTextSize * (countStrLength(props.character) / 2))}
      // x={props.x}
      y={props.y - StampTextSize / 2}
      draggable={false}
      onTap={props.onTapped}
      onClick={props.onTapped}
    />
  )
}
