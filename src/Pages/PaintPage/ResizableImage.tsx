import { group, groupEnd } from 'console';
import React from 'react';
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

  // ここを直す 
  const shapeRef = React.useRef<any>();
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
    }
  }));

  React.useEffect(() => {
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
      {holds.map((props, i) => <NormalHoldCircle {...props}/>)}
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