import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { NormalHoldCircleProps, NormalHoldCircle } from './NormalHoldCircle';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';

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
      const normalHold = {
        key: holds.length++,
        x: (window.innerWidth / 2),
        y: (window.innerHeight / 2)
      }
      useHolds(holds.concat([normalHold]).filter(x => x));
      trRef?.current?.nodes([shapeRef.current].concat(circleRefs.filter(x => x.current != null).map(x => x.current)));
    }
  }));

  const OnTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
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
  }

  React.useEffect(() => {
    if (circleRefs == undefined) return;

    if (props.isSelected) {
      trRef.current.nodes([shapeRef.current].concat(circleRefs.filter(x => x.current != null).map(x => x.current)));
      trRef.current.getLayer().batchDraw();
    }
  }, [props.isSelected]);

  let lastDist = 0;

  // const getDistance = (p1:{x:number, y:number}, p2:{x:number, y:number}) => {
  //   return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  // }

  const getDistance = (p1:Touch, p2:Touch) => {
    return Math.sqrt(Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2));
  }

  return (
    <Group
      onTouchMove={res => {
      const stage = res.currentTarget;
      var touch1 = res.evt.touches[0];
      var touch2 = res.evt.touches[1];

      if (touch1 && touch2) {
        var dist = getDistance(touch1,touch2);

        if (!lastDist) {
          lastDist = dist;
        }
        console.log("3", dist);

        var scale = (stage.scaleX() * dist) / lastDist;

        console.log("4", lastDist);
        stage.scaleX(scale);
        stage.scaleY(scale);
        stage.draw();
        lastDist = dist;
        res.evt.preventDefault();
      }
    }}
    onTouchEnd={() => {
      lastDist = 0;
    }}
    >
      <Image
        draggable={true}
        image={props.src}
        onClick={props.onSelect}
        onTap={props.onSelect}
        ref={shapeRef}
        {...props.shapeProps}
        onTransformEnd={OnTransformEnd}
      />
      {holds.map((props, i) => <NormalHoldCircle ref={circleRefs[i]} {...props}/>)}
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
      {/* {props.isSelected && (
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
      )} */}
    </Group>
  );
};

export const ResizableImage = forwardRef(ResizableImageBase)