import { Text } from 'react-konva';
import { forwardRef } from 'react';
import { countStrLength } from '../../../Functions/CountStrLength';

export type HoldTextProps = {
  key:number,
  keyStr: string,
  x: number,
  y: number,
  character: string,
  fontSize: number,
  color: string,
  scale: number | undefined,
  onDoubleTapped?: ((ev: string) => void)
}

export const isHoldTextProps = (arg: unknown): arg is HoldTextProps =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as HoldTextProps).x === 'number' &&
    typeof (arg as HoldTextProps).y === 'number' &&
    (typeof (arg as HoldTextProps).scale === 'number' || (arg as HoldTextProps).scale === undefined) &&
    typeof (arg as HoldTextProps).character === 'string' &&
    typeof (arg as HoldTextProps).fontSize === 'number';

let HoldTextBase = (props: HoldTextProps, ref: any) => {
  const onDoubleTapped = () => {
    if (!props.onDoubleTapped) return;
    props.onDoubleTapped(props.keyStr);
  }

  return <Text
    scaleX={props.scale}
    scaleY={props.scale}
    ref={ref}
    fontSize={props.fontSize}
    strokeWidth={1}
    stroke='white'
    fill={props.color}
    text={props.character}
    x={props.x - ((props.fontSize * (props.scale ?? 1) * countStrLength(props.character) ) / 2)}
    y={props.y - props.fontSize * (props.scale ?? 1) / 2}
    draggable={false}
    onDblTap={onDoubleTapped}
  />
}

export const HoldText = forwardRef(HoldTextBase)
