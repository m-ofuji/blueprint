import { group, groupEnd } from 'console';
import React, { createRef, useRef } from 'react';
import { Image, Rect, Transformer, Group } from 'react-konva';
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

// export const ResizableImage = ({shapeProps, isSelected, onSelect, onChange, src } : ResizableImageProps) => {
let ResizableImageBase = (props : ResizableImageProps, ref : any) => {

  const item = [
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    { x: window.innerWidth / 2 + 20, y: window.innerHeight / 2 + 20},
    { x: window.innerWidth / 2 + 40, y: window.innerHeight / 2 + 40},
  ];

  // ここを直す 
  const shapeRef = React.useRef<any>();
  // const circleRefs = item.map(() => createRef<any>());
  const circleRefs = useRef(item.map(() => createRef<any>()))
  console.log(circleRefs);
  const trRef = React.useRef<any>(null);
  const [holds, useHolds] = React.useState<NormalHoldCircleProps[]>([]);

  // const useHold = (props: NormalHoldCircleProps) => {
  //   useHolds(holds.concat([props]));
  // }

  useImperativeHandle(ref, () => ({
    useHold: () => {
      const normalHold = {
        key: holds.length++,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
      console.log(holds.length);
      useHolds(holds.concat([normalHold]));
      // circleRef = holds.map(() => React.useRef<any>());
    }
  }));

  React.useEffect(() => {
    console.log(circleRefs);
    console.log(shapeRef)
    if (circleRefs == undefined) return;

    if (props.isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  return (
    <Group>
      <Image
        // image={src}
        // onClick={onSelect}
        // onTap={onSelect}
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
          // onChange({
          // ...shapeProps,
          props.onChange({
            ...props.shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {item.map((props, i) => <NormalHoldCircle ref={circleRefs.current[i]} {...props}/>)}
      {/* <NormalHoldCircle ref={circleRef[i]} {...props}/>
      <NormalHoldCircle ref={circleRef[i]} {...props}/> */}
      {/* {holds.map((props, i) => <NormalHoldCircle ref={circleRefs[i]} {...props}/>)} */}
      {/* {isSelected && ( */}
      {props.isSelected && (
        <Transformer
          keepRatio
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]}
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