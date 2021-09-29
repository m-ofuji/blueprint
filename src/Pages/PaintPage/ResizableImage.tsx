import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { NormalHoldCircleProps, NormalHoldCircle } from './NormalHoldCircle';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

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
  const [scale, useScale] = useState(1);
  const [lastDist, useLastDist] = useState(0);
  const [lastCenter, useLastCenter] = useState<{x: number, y:number} | null>(null);

  // let lastDist = 0;
  // let lastCenter: {x: number, y:number} | null = null;

  useImperativeHandle(ref, () => ({
    useHold: () => {
      circleRefs.push(createRef<any>());
      useCircleRefs(circleRefs);
      const normalHold = {
        key: holds.length++,
        x: (window.innerWidth / 2) - (coords.x * scale),
        y: (window.innerHeight / 2) - (coords.y * scale),
        scale: scale
      }
      useHolds(holds.concat([normalHold]).filter(x => x));
    }
  }));

  const OnDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    useCoords({x: e.target.x(), y: e.target.y()});
  }

  const OnTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    const isDoubleTouched = touch1 && touch2;

    const stage = e.currentTarget;
    if (isDoubleTouched && stage.isDragging()) {
      stage.stopDrag();
    }

    useLastCenter(isDoubleTouched ? lastCenter ?? getCenter(touch1, touch2) : lastCenter);

    const newCenter = isDoubleTouched ? getCenter(touch1, touch2) : lastCenter;

    const dist = isDoubleTouched ? getDistance(touch1, touch2) : 0;

    useLastDist(isDoubleTouched ? lastDist ?? dist : 0);

    const pointTo = {
      x: newCenter ? (newCenter.x - stage.x()) / stage.scaleX() : 0,
      y: newCenter ? (newCenter.y - stage.y()) / stage.scaleX() : 0,
    };

    useScale(lastDist === 0 ? lastDist : 1 / (stage.scaleX() * (dist / lastDist)));

    // const scale = stage.scaleX() * (dist / lastDist);

    

    if (isDoubleTouched) {
      stage.scaleX(scale);
      stage.scaleY(scale);

      // calculate new position of the stage
      const dx = newCenter ? newCenter.x - (lastCenter?.x ?? 0) : 0;
      const dy = newCenter ? newCenter.y - (lastCenter?.y ?? 0) : 0;

      const newPos = {
        x: newCenter ? newCenter.x - pointTo.x * scale + dx : 0,
        y: newCenter ? newCenter.y - pointTo.y * scale + dy : 0,
      };

      stage.position(newPos);
    }

    useLastDist(dist);
    useLastCenter(newCenter);

    // if (touch1 && touch2) {
    //   const stage = e.currentTarget;
    //   if (stage.isDragging()) {
    //     stage.stopDrag();
    //   }

    //   if (!lastCenter) {
    //     lastCenter = getCenter(touch1, touch2);
    //     return;
    //   }
    //   const newCenter = getCenter(touch1, touch2);

    //   const dist = getDistance(touch1, touch2);

    //   if (!lastDist) {
    //     lastDist = dist;
    //   }

    //   const pointTo = {
    //     x: (newCenter.x - stage.x()) / stage.scaleX(),
    //     y: (newCenter.y - stage.y()) / stage.scaleX(),
    //   };

    //   scaled = 1 / (stage.scaleX() * (dist / lastDist));

    //   const scale = stage.scaleX() * (dist / lastDist);

    //   stage.scaleX(scale);
    //   stage.scaleY(scale);

    //   // calculate new position of the stage
    //   const dx = newCenter.x - lastCenter.x;
    //   const dy = newCenter.y - lastCenter.y;

    //   const newPos = {
    //     x: newCenter.x - pointTo.x * scale + dx,
    //     y: newCenter.y - pointTo.y * scale + dy,
    //   };

    //   stage.position(newPos);

    //   lastDist = dist;
    //   lastCenter = newCenter;
    // }
  }

  const OnTouchEnd = () => {
    useLastDist(0);
    useLastCenter(null);
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


  Konva.hitOnDragEnabled = true;
  return (
    <Group
      draggable={true}
      onTouchMove={OnTouchMove}
      onTouchEnd={OnTouchEnd}
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