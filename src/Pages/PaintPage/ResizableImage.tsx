import { group, groupEnd } from 'console';
import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { NormalHoldCircleProps, NormalHoldCircle } from './NormalHoldCircle';
import { useImperativeHandle, forwardRef } from 'react';

export type ResizableImageProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  shapeProps:any;
  isSelected:boolean;
  onSelect:any;
  onChange: any;
  src: CanvasImageSource | undefined
}

let ResizableImageBase = (props : ResizableImageProps, ref : any) => {

  // ここを直す 
  const shapeRef = React.useRef<any>();
  const [circleRefs, useCircleRefs] = useState<React.RefObject<any>[]>([]);
  const trRef = React.useRef<any>(null);
  const [holds, useHolds] = React.useState<NormalHoldCircleProps[]>([]);

  useImperativeHandle(ref, () => ({
    useHold: () => {
      const normalHold = {
        key: holds.length++,
        x: window.innerWidth / 2 + holds.length *10,
        y: window.innerHeight / 2
      }
      useHolds(holds.concat([normalHold]));
      useCircleRefs(circleRefs.concat([createRef<any>()]));
    }
  }));

  React.useEffect(() => {
    console.log(circleRefs);
    console.log(shapeRef)
    if (circleRefs == undefined) return;

    if (props.isSelected) {
      trRef.current.nodes([shapeRef.current].concat(circleRefs.filter(x => x.current != null).map(x => x.current)));
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  return (
    <Group>
      <Image
        image={props.src}
        onClick={props.onSelect}
        onTap={props.onSelect}
        ref={shapeRef}
        {...props.shapeProps}
        onDragEnd={(e) => {
          props.onChange({
            ...props.shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;

          if (node == null) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          props.onChange({
            ...props.shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {holds.map((props, i) => <NormalHoldCircle ref={circleRefs[i]} {...props}/>)}
      {props.isSelected && (
        <Transformer
          keepRatio
          enabledAnchors={['top-left','top-right','bottom-left','bottom-right']}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
};

export const ResizableImage = forwardRef(ResizableImageBase)