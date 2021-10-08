import { Text } from 'react-konva';
import { forwardRef } from 'react';

export type HoldTextProps = {
  x: number,
  y: number,
  character: string,
  scale: number | undefined
}

let HoldTextBase = (props: HoldTextProps, ref: any) => {
  return <Text
    scaleX={props.scale}
    scaleY={props.scale}
    ref={ref}
    fontSize={50}
    fill={'red'}
    text={props.character}
    x={props.x}
    y={props.y}
    draggable={false}
  />
}

export const HoldText = forwardRef(HoldTextBase)
