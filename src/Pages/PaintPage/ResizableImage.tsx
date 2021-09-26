import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { NormalHoldCircleProps, NormalHoldCircle } from './NormalHoldCircle';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';
import { triggerAsyncId } from 'async_hooks';

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
  const [coords, useCoords] = useState({x:0, y:0});

  useImperativeHandle(ref, () => ({
    useHold: () => {
      circleRefs.push(createRef<any>());
      useCircleRefs(circleRefs);
      const normalHold = {
        key: holds.length++,
        x: (window.innerWidth / 2) - coords.x,
        y: (window.innerHeight / 2) - coords.y
      }
      useHolds(holds.concat([normalHold]).filter(x => x));
    }
  }));

  const OnDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    useCoords({x: e.target.x(), y: e.target.y()});
  }

  let lastDist = 0;

  const getDistance = (p1:Touch, p2:Touch) => {
    return Math.sqrt(Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2));
  }
  Konva.hitOnDragEnabled = true;
  return (
    <Group
      draggable={true}
      onTouchMove={res => {
        const stage = res.currentTarget;
        var touch1 = res.evt.touches[0];
        var touch2 = res.evt.touches[1];

        if (touch1 && touch2) {
          if (stage.isDragging()) {
            stage.stopDrag();
          }

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
      onDragEnd={OnDragEnd}
    >
      <Image
        image={props.src}
        onClick={props.onSelect}
        onTap={props.onSelect}
        ref={shapeRef}
        {...props.shapeProps}
      />
      {holds.map((props, i) => <NormalHoldCircle ref={circleRefs[i]} {...props}/>)}
    </Group>
  );
};

export const ResizableImage = forwardRef(ResizableImageBase)