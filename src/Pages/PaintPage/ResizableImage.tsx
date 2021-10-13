import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { HoldCircleProps, HoldCircle, isHoldCircleProps } from './Holds/HoldCircle';
import { HoldTextProps, HoldText, isHoldTextProps } from './Holds/HoldText';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { SizeProps } from './PaintPage';

export type ResizableImageProps = {
  ref?: React.ForwardedRef<HTMLInputElement>;
  centerX: number;
  centerY: number;
  src: CanvasImageSource | undefined;
  x?: number;
  y?: number;
  updateSizeProps: React.Dispatch<React.SetStateAction<SizeProps>>;
  updateIsUndoEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  updateIsRedoEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

let ResizableImageBase = (props : ResizableImageProps, ref : any) => {

  // ここを直す 
  const groupRef = React.useRef<any>();
  const [circleRefs, useCircleRefs] = useState<React.RefObject<any>[]>([]);
  const [textRefs, useTextRefs] = useState<React.RefObject<any>[]>([]);
  const [holds, useHolds] = useState<HoldCircleProps[]>([]);
  const [texts, useHoldText] = useState<HoldTextProps[]>([]);
  const [scale, useScale] = useState(1);
  const [lastDist, useLastDist] = useState(0);
  const [lastCenter, useLastCenter] = useState<{x: number, y: number} | null>(null);
  const [undo, useUndo] = useState<[any, () => void][]>([]);
  const [redo, useRedo] = useState<[any, () => void][]>([]);

  useImperativeHandle(ref, () => ({
    useHold: (color: string) => {
      circleRefs.push(createRef<any>());
      useCircleRefs(circleRefs);
      const normalHold = {
        key: holds.length++,
        x: ((window.innerWidth / 2) - (groupRef.current.x())) * (1 / scale),
        y: ((window.innerHeight / 2) - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale,
        color:color
      }
      useHolds(holds.concat([normalHold]).filter(x => x));

      const Undo = () => useHolds(old => old.filter(x => x !== normalHold ));
      useUndo(old => [...old, [normalHold, Undo]]);
      props.updateIsUndoEnabled(false);
      useRedo([]);
      props.updateIsRedoEnabled(true);
    },
    useHoldText: (text: string) => {
      textRefs.push(createRef<any>());
      useTextRefs(textRefs);
      const t = {
        key: holds.length++,
        x: ((window.innerWidth / 2) - (groupRef.current.x())) * (1 / scale),
        y: ((window.innerHeight / 2) - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale,
        character:text
      }
      useHoldText(texts.concat([t]).filter(x => x));
      const Undo = () => useHoldText(old => old.filter(x => x !== t));
      useUndo(old => [...old, [t, Undo]]);
      props.updateIsUndoEnabled(false);
      useRedo([]);
      props.updateIsRedoEnabled(true);
    },
    Undo: () => {
      const last = undo[undo.length - 1];
      const isEmpty = !last;
      let Redo: () => void;
      let lastItem: any;
      if (!isEmpty) {
        lastItem = last[0];
        if (isHoldCircleProps(lastItem)) {
          Redo = () => useHolds(old => old.concat([lastItem]).filter(x => x));
        } else if (isHoldTextProps(lastItem)) {
          Redo = () => useHoldText(old => old.concat([lastItem]).filter(x => x));
        }
      }

      useRedo(old => {
        if (!isEmpty) {
          old.push([lastItem, Redo]);
        }
        const newRedo = old;
        props.updateIsRedoEnabled(newRedo.length <= 0);
        return newRedo;
      });

      if (!isEmpty) {
        last[1]();
        undo.pop();
      }
      props.updateIsUndoEnabled(undo.length <= 0);
      useUndo(undo);
    },
    Redo: () => {
      const last = redo[redo.length - 1];

      const isEmpty = !last;
      let Undo: () => void;
      let lastItem: any;
      if (!isEmpty) {
        lastItem = last[0];
        if (isHoldCircleProps(lastItem)) {
          Undo = () => useHolds(holds.filter(x => x !== lastItem ));
        } else if (isHoldTextProps(lastItem)) {
          Undo = () => useHoldText(texts.filter(x => x !== lastItem));
        }
      }
      
      useUndo(old => {
        if (!isEmpty) {
          old.push([lastItem, Undo]);
        }
        const newUndo = old;
        props.updateIsUndoEnabled(newUndo.length <= 0);
        return newUndo;
      });

      if (!isEmpty) {
        console.log('redo');
        last[1]();
        redo.pop();
      }

      props.updateIsRedoEnabled(redo.length <= 0);
      useRedo(redo);
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

    props.updateSizeProps((old) => {
      return {
        ...old,
        scaleX: 1 / newScale,
        scaleY: 1 / newScale,
        x: groupRef.current.x(),
        y: groupRef.current.y()
      } 
    });
  }

  const OnTouchEnd = () => {
    useLastDist(0);
    useLastCenter(null);
  }

  const OnDragEnd = () => {
    props.updateSizeProps((old) => { return { ...old, x: groupRef.current.x(), y: groupRef.current.y() }});
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
      <Image image={props.src}/>
      {holds.map((props, i) => <HoldCircle ref={circleRefs[i]} {...props}/>)}
      {texts.map((props, i) => <HoldText ref={textRefs[i]} {...props}/>)}
    </Group>
  );
};

export const ResizableImage = forwardRef(ResizableImageBase)