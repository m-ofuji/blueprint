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

  const getDistance = (p1:Touch, p2:Touch) => {
    return Math.sqrt(Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2));
  }

  function getCenter(p1:Touch, p2:Touch) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2,
    };
  }

  let lastDist = 0;
  let lastCenter: {x: number, y:number} | null = null;
  Konva.hitOnDragEnabled = true;
  return (
    <Group
      draggable={true}
      onTouchMove={e => {
        e.evt.preventDefault();
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          const stage = e.currentTarget;
          if (stage.isDragging()) {
            stage.stopDrag();
          }

          if (!lastCenter) {
            lastCenter = getCenter(touch1, touch2);
            return;
          }
          var newCenter = getCenter(touch2, touch2);

          var dist = getDistance(touch1, touch2);

          if (!lastDist) {
            lastDist = dist;
          }

          var pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
          };

          var scale = stage.scaleX() * (dist / lastDist);
          circleRefs.forEach(x => {
            x.current.scaleX(scale);
            x.current.scaleY(scale);
          });

          stage.scaleX(scale);
          stage.scaleY(scale);

          // calculate new position of the stage
          var dx = newCenter.x - lastCenter.x;
          var dy = newCenter.y - lastCenter.y;

          var newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
          };

          stage.position(newPos);

          lastDist = dist;
          lastCenter = newCenter;
        }
      }}
      onTouchEnd={() => {
        lastDist = 0;
        lastCenter = null;
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