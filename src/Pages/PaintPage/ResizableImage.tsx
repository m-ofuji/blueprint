import React, { createRef, useState } from 'react';
import { Image, Transformer, Group } from 'react-konva';
import { HoldCircleProps, HoldCircle, isHoldCircleProps } from './Holds/HoldCircle';
import { HoldTextProps, HoldText, isHoldTextProps } from './Holds/HoldText';
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
  updateSizeProps: React.Dispatch<React.SetStateAction<SizeProps>>;
  updateUndoMethods: React.Dispatch<React.SetStateAction<[() => void, () => void][]>>;
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
      // useHistory(old => old.concat(normalHold));
      // const Redo = () => useHolds(holds.concat([normalHold]).filter(x => x));
      // props.updateUndoMethods(old => old.concat([Undo, Redo]));

      const Undo = () => useHolds(holds.filter(x => x !== normalHold ));
      useUndo(old => [...old, [normalHold, Undo]]);
      useRedo([]);
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
      // useHistory(old => old.concat(t));
      
      // const Redo = () => useHoldText(texts.concat([t]).filter(x => x));
      // props.updateUndoMethods(old => old.concat([Undo, Redo]));
      const Undo = () => useHoldText(texts.filter(x => x !== t));
      // useUndo(old => old.concat([t, Undo]));
      useUndo(old => [...old, [t, Undo]]);
      useRedo([]);
    },
    Undo: () => {
      const last = undo[undo.length - 1];
      const lastItem = last[0];
      let Redo : () => void;
      if (isHoldCircleProps(lastItem)) {
        Redo = () => useHolds(holds.concat([lastItem]).filter(x => x));
        // Redo = addHold(lastItem);
      } else if (isHoldTextProps(lastItem)) {
        Redo = () => useHoldText(texts.concat([lastItem]).filter(x => x));
        // Redo = addText(lastItem);
      }
      // useRedo(old => old.concat([lastItem, Redo]));
      useRedo(old => [...old, [lastItem, Redo]]);
      last[1]();
      undo.pop();
      useUndo(undo);
    },
    Redo: () => {
      const last = redo[redo.length - 1];
      const lastItem = last[0];
      let Undo: () => void;
      if (isHoldCircleProps(lastItem)) {
        // undo = removeHold(lastItem);
        Undo = () => useHolds(holds.filter(x => x !== lastItem ));
      } else if (isHoldTextProps(lastItem)) {
        // Undo = removeText(lastItem);
        Undo = () => useHoldText(texts.filter(x => x !== lastItem));
      }
      // useUndo(old => old.concat([lastItem, Undo]));
      useUndo(old => [...old, [lastItem, Undo]]);
      last[1]();
      redo.pop();
      useRedo(redo);
    }
  }));

  // const removeHold = (hold: HoldCircleProps) => () =>  useHolds(holds.filter(x => x !== hold ));
  // const addHold = (hold: HoldCircleProps) => () =>  useHolds(holds.concat([hold]).filter(x => x));
  // const removeText = (text: HoldTextProps) => () =>  useHoldText(texts.filter(x => x !== text));
  // const addText = (text: HoldTextProps) => () =>  useHoldText(texts.concat([text]).filter(x => x));

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