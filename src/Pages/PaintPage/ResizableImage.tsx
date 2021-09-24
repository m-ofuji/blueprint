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
  centerX: number;
  centerY: number;
  src: CanvasImageSource | undefined;
  x?: number;
  y?: number;
}

let ResizableImageBase = (props : ResizableImageProps, ref : any) => {

  // ここを直す 
  const shapeRef = React.useRef<any>();
  const [circleRefs, useCircleRefs] = useState<React.RefObject<any>[]>([]);
  const trRef = React.useRef<any>(null);
  const [holds, useHolds] = useState<NormalHoldCircleProps[]>([]);

  useImperativeHandle(ref, () => ({
    useHold: () => {
      circleRefs.push(createRef<any>());
      useCircleRefs(circleRefs);

      const image = shapeRef.current;
      // console.log(image.x());
      // console.log(image.y());
      console.log(shapeRef.current);

      const normalHold = {
        key: holds.length++,
        x: (window.innerWidth / 2) - shapeRef.current.x(),
        y: (window.innerHeight / 2) - shapeRef.current.y()
      }
      useHolds(holds.concat([normalHold]).filter(x => x));
      trRef?.current?.nodes([shapeRef.current].concat(circleRefs.filter(x => x.current != null).map(x => x.current)));
    }
  }));

  React.useEffect(() => {
    if (circleRefs == undefined) return;

    if (props.isSelected) {
      trRef.current.nodes([shapeRef.current].concat(circleRefs.filter(x => x.current != null).map(x => x.current)));
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  return (
    <Group
      onDragEnd={(e) => {
        console.log(e);
        props.onChange({
          ...props.shapeProps,
          x: e.target.x(),
          y: e.target.y()
        });
      }}>
      <Image
        image={props.src}
        onClick={props.onSelect}
        onTap={props.onSelect}
        ref={shapeRef}
        {...props.shapeProps}
        onDragMove={(e) => {
          console.log(e);
        }}
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