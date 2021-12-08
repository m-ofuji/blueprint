import { Circle } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { HoldCircleRadius, HoldCircleStrokeWidth } from '../Constants';
import { TARGET_COLOR } from '../../../Constants/Colors';

export type NormalTargetProps = {
  x: number,
  y: number,
  isVisible: boolean,
  onTapped: (evt: KonvaEventObject<Event>) => void
}

export const NormalTarget = (props: NormalTargetProps) => {
  return (
    <>
      <Circle
        fill="#00000000"
        stroke="#ffffff"
        radius={HoldCircleRadius}
        strokeWidth={HoldCircleStrokeWidth + 5}
        visible={props.isVisible}
        x={props.x}
        y={props.y}
        draggable={false}
        onTap={props.onTapped}
        onClick={props.onTapped}
      />
      <Circle
        fill="#00000000"
        stroke={TARGET_COLOR}
        radius={HoldCircleRadius}
        strokeWidth={HoldCircleStrokeWidth}
        visible={props.isVisible}
        x={props.x}
        y={props.y}
        draggable={false}
        onTap={props.onTapped}
        onClick={props.onTapped}
      />
    </>
  )
}
