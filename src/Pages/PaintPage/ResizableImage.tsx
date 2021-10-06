import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { NormalHoldCircleProps, NormalHoldCircle } from './NormalHoldCircle';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { SizeProps } from './PaintPage';
import { updateSourceFile } from 'typescript';

export type ResizableImageProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  centerX: number;
  centerY: number;
  src: CanvasImageSource | undefined;
  x?: number;
  y?: number;
  // sizeProps: SizeProps;
  // updateSizeProps:React.Dispatch<React.SetStateAction<SizeProps>>;
  updateX: React.Dispatch<React.SetStateAction<number>>;
  updateY: React.Dispatch<React.SetStateAction<number>>;
  updateScaleX: React.Dispatch<React.SetStateAction<number>>;
  updateScaleY: React.Dispatch<React.SetStateAction<number>>;
}

let ResizableImageBase = (props : ResizableImageProps, ref : any) => {

  // ここを直す 
  const groupRef = React.useRef<any>();
  const [circleRefs, useCircleRefs] = useState<React.RefObject<any>[]>([]);
  const [holds, useHolds] = useState<NormalHoldCircleProps[]>([]);
  const [scale, useScale] = useState(1);
  const [lastDist, useLastDist] = useState(0);
  const [lastCenter, useLastCenter] = useState<{x: number, y: number} | null>(null);

  useImperativeHandle(ref, () => ({
    useHold: () => {
      circleRefs.push(createRef<any>());
      useCircleRefs(circleRefs);
      const normalHold = {
        key: holds.length++,
        x: ((window.innerWidth / 2) - (groupRef.current.x())) * (1 / scale),
        y: ((window.innerHeight / 2) - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale
      }
      useHolds(holds.concat([normalHold]).filter(x => x));
    }
  }));

  const OnTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    const isDoubleTouched = touch1 && touch2;

    const stage = e.currentTarget;
    if (isDoubleTouched && stage.isDragging()) {
      stage.stopDrag();
    }

    let newLastCenter = lastCenter;
    let newDist = lastDist;
    let newScale = scale;
    let pointTo: {x:number, y:number} | null = null;

    if (isDoubleTouched) {
      if (!newLastCenter) {
        newLastCenter = getCenter(touch1, touch2);
      } else {
        newLastCenter = getCenter(touch1, touch2);
        newDist = getDistance(touch1, touch2);
        pointTo = {
          x: (newLastCenter.x - stage.x()) / stage.scaleX(),
          y: (newLastCenter.y - stage.y()) / stage.scaleX(),
        };

        const dividing = !lastDist ? newDist : lastDist;

        newScale = stage.scaleX() * (newDist / (dividing));
        stage.scaleX(newScale);
        stage.scaleY(newScale);
      }
    }

    if (lastCenter !== null && newLastCenter !== null && pointTo !== null && isDoubleTouched) {

      const dx = newLastCenter.x - lastCenter.x;
      const dy = newLastCenter.y - lastCenter.y;
  
      const newPos = {
        x: newLastCenter.x - pointTo.x * stage.scaleX() + dx,
        y: newLastCenter.y - pointTo.y * stage.scaleX() + dy,
      };
      stage.position(newPos);
    }

    useLastCenter(newLastCenter);
    useLastDist(newDist);
    useScale(newScale);

    props.updateScaleX(newScale);
    props.updateScaleY(newScale);
    props.updateX(groupRef.current.x());
    props.updateY(groupRef.current.y());

    // props.updateSizeProps({...props.sizeProps, ...{scaleX: newScale}});
    // props.updateSizeProps({...props.sizeProps, ...{scaleY: newScale}});
    // props.updateSizeProps({...props.sizeProps, ...{x: groupRef.current.x()}});
    // props.updateSizeProps({...props.sizeProps, ...{y: groupRef.current.y()}});
  }

  const OnTouchEnd = () => {
    useLastDist(0);
    useLastCenter(null);
  }

  const OnDragEnd = () => {
    
    props.updateX(groupRef.current.x());
    props.updateY(groupRef.current.y());
    // props.updateSizeProps({...props.sizeProps, ...{x: groupRef.current.x()}});
    // props.updateSizeProps({...props.sizeProps, ...{y: groupRef.current.y()}});

    // props.updateX(groupRef.current.x());
    // props.updateY(groupRef.current.y());
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
      ref={groupRef}
    >
      <Image
        image={props.src}
      />
      {holds.map((props, i) => <NormalHoldCircle ref={circleRefs[i]} {...props}/>)}
    </Group>
  );
};

export const ResizableImage = forwardRef(ResizableImageBase)