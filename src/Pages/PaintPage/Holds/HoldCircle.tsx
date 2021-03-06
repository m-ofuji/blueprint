import { Circle } from 'react-konva';
import { forwardRef } from 'react';
import { HoldCircleRadius, HoldCircleStrokeWidth } from '../Constants';
import { KonvaEventObject } from 'konva/lib/Node';
import { HoldProps } from './HoldProps';

export interface HoldCircleProps extends HoldProps { }

export const isHoldCircleProps = (arg: unknown): arg is HoldCircleProps =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as HoldCircleProps).id === 'number' &&
    typeof (arg as HoldCircleProps).x === 'number' &&
    typeof (arg as HoldCircleProps).y === 'number' &&
    (typeof (arg as HoldCircleProps).scale === 'number' || (arg as HoldCircleProps).scale === undefined) &&
    typeof (arg as HoldCircleProps).color === 'string';

let HoldCircleBase = (props: HoldCircleProps, ref: any) => {
  const doubleTapped = (ev: KonvaEventObject<Event>) => {
    if (!props.onDoubleTapped) return;
    props.onDoubleTapped(props.id);
  }

  return (
    <>
      <Circle
        onDblTap={doubleTapped}
        scaleX={props.scale}
        scaleY={props.scale}
        ref={ref}
        fill='#00000000'
        stroke={'#ffffff'}
        radius={HoldCircleRadius}
        strokeWidth={HoldCircleStrokeWidth + 5}
        x={props.x}
        y={props.y}
        draggable={false}
      />
      <Circle
        onDblTap={doubleTapped}
        scaleX={props.scale}
        scaleY={props.scale}
        ref={ref}
        fill="#00000000"
        stroke={props.color}
        radius={HoldCircleRadius}
        strokeWidth={HoldCircleStrokeWidth}
        x={props.x}
        y={props.y}
        draggable={false}
      />
    </>
  )
}

export const HoldCircle = forwardRef(HoldCircleBase)
