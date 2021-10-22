import { Text } from 'react-konva';
import { forwardRef } from 'react';
import { StampTextSize } from '../Constants';

export type HoldTextProps = {
  x: number,
  y: number,
  character: string,
  scale: number | undefined
}

export const isHoldTextProps = (arg: unknown): arg is HoldTextProps =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as HoldTextProps).x === 'number' &&
    typeof (arg as HoldTextProps).y === 'number' &&
    (typeof (arg as HoldTextProps).scale === 'number' || (arg as HoldTextProps).scale === undefined) &&
    typeof (arg as HoldTextProps).character === 'string';

let HoldTextBase = (props: HoldTextProps, ref: any) => {
  return <Text
    scaleX={props.scale}
    scaleY={props.scale}
    ref={ref}
    fontSize={StampTextSize}
    strokeWidth={1}
    stroke='white'
    fill={'#ff0d0d'}
    text={props.character}
    x={props.x - (StampTextSize * props.character.length) / 2}
    y={props.y - StampTextSize / 2}
    draggable={false}
  />
}

export const HoldText = forwardRef(HoldTextBase)
