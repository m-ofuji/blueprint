import React, { createRef, useState } from 'react';
import { Image, Group } from 'react-konva';
import { HoldCircleProps, HoldCircle, isHoldCircleProps } from './Holds/HoldCircle';
import { HoldTextProps, HoldText, isHoldTextProps } from './Holds/HoldText';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { WallImageProps } from '../../Types/WallImageProps';
import { MarkerPositionX, MarkerPositionY } from './Constants';

let WallImageBase = (props : WallImageProps, ref : any) => {

  const groupRef = React.useRef<any>();
  const [circleRefs, setCircleRefs] = useState<React.RefObject<any>[]>([]);
  const [textRefs, setTextRefs] = useState<React.RefObject<any>[]>([]);
  const [holds, setHolds] = useState<HoldCircleProps[]>([]);
  const [texts, setHoldText] = useState<HoldTextProps[]>([]);
  const [scale, setScale] = useState(1);
  const [lastDist, setLastDist] = useState(0);
  const [lastCenter, setLastCenter] = useState<{x: number, y: number} | null>(null);
  const [undo, setUndo] = useState<[any, () => void][]>([]);
  const [redo, setRedo] = useState<[any, () => void][]>([]);
  const [stampKeys, setStampKeys] = useState<number>(0);

  const onCirleDoubleTapped = (keyStr: string) => {
    setHolds(old => old.filter(x => x.keyStr !== keyStr ));
  }

  const onTextDoubleTapped = (keyStr: string) => {
    setHoldText(old => old.filter(x => x.keyStr !== keyStr ));
  }

  useImperativeHandle(ref, () => ({
    addCircle: (color: string) => {
      circleRefs.push(createRef<any>());
      setCircleRefs(circleRefs);

      setStampKeys(stampKeys + 1);

      const normalHold = {
        key: holds.length++,
        keyStr: stampKeys.toString(),
        x: (MarkerPositionX - (groupRef.current.x())) * (1 / scale),
        y: (MarkerPositionY - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale,
        color:color,
        onDoubleTapped: onCirleDoubleTapped
      }
      setHolds(holds.concat([normalHold]).filter(x => x));

      const undo = () => setHolds(old => old.filter(x => x !== normalHold ));
      setUndo(old => [...old, [normalHold, undo]]);
      resetRedoAndUndo();
    },
    addText: (text: string) => {
      textRefs.push(createRef<any>());
      setTextRefs(textRefs);

      setStampKeys(stampKeys + 1);

      const t = {
        key: holds.length++,
        keyStr: stampKeys.toString(),
        x: (MarkerPositionX - (groupRef.current.x())) * (1 / scale),
        y: (MarkerPositionY - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale,
        character:text,
        onDoubleTapped: onTextDoubleTapped
      }
      setHoldText(texts.concat([t]).filter(x => x));
      const Undo = () => setHoldText(old => old.filter(x => x !== t));
      setUndo(old => [...old, [t, Undo]]);
      resetRedoAndUndo();
    },
    undo: () => {
      const lastUndo = undo[undo.length - 1];

      if (!lastUndo) return;

      const lastItem = lastUndo[0];
      if (isHoldCircleProps(lastItem)) {
        setRedo(old => [...old, [lastItem, () => setHolds(old => old.concat([lastItem]).filter(x => x))]]);
      } else if (isHoldTextProps(lastItem)) {
        setRedo(old => [...old, [lastItem, () => setHoldText(old => old.concat([lastItem]).filter(x => x))]]);
      }

      props.updateIsRedoDisabled(redo.length <= 0);

      // 戻る処理
      lastUndo[1]();

      undo.pop();
      props.updateIsUndoDisabled(undo.length <= 0);
      setUndo(undo);
    },
    redo: () => {
      const lastRedo = redo[redo.length - 1];

      if (!lastRedo) return;

      const lastItem = lastRedo[0];
      if (isHoldCircleProps(lastItem)) {
        setUndo(old => [...old, [lastItem, () => setHolds(holds.filter(x => x !== lastItem ))]]);
      } else if (isHoldTextProps(lastItem)) {
        setUndo(old => [...old, [lastItem, () => setHoldText(texts.filter(x => x !== lastItem))]]);
      }

      props.updateIsUndoDisabled(undo.length <= 0);

      // 進む処理
      lastRedo[1]();

      redo.pop();
      props.updateIsRedoDisabled(redo.length <= 0);
      setRedo(redo);
    }
  }));

  const resetRedoAndUndo = () => {
    props.updateIsUndoDisabled(false);
    setRedo([]);
    props.updateIsRedoDisabled(true);
  }

  // リサイズ処理
  const OnTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    const isDoubleTouched = touch1 && touch2;

    if (!isDoubleTouched) return;

    const stage = e.currentTarget;
    if (stage.isDragging()) {
      stage.stopDrag();
    }

    if (!lastCenter) {
      setLastCenter(getCenter(touch1, touch2));
      return;
    }

    const newLastCenter = getCenter(touch1, touch2);
    const newDist = getDistance(touch1, touch2);
    const pointTo = {
      x: (newLastCenter.x - stage.x()) / stage.scaleX(),
      y: (newLastCenter.y - stage.y()) / stage.scaleX(),
    };

    const dividing = !lastDist ? newDist : lastDist;

    const newScale = stage.scaleX() * (newDist / (dividing));
    stage.scaleX(newScale);
    stage.scaleY(newScale);

    const dx = newLastCenter.x - lastCenter.x;
    const dy = newLastCenter.y - lastCenter.y;

    const newPos = {
      x: newLastCenter.x - pointTo.x * stage.scaleX() + dx,
      y: newLastCenter.y - pointTo.y * stage.scaleX() + dy,
    };
    stage.position(newPos);

    setLastCenter(newLastCenter);
    setLastDist(newDist);
    setScale(newScale);

    props.updateSizeProps((old) => {
      return {
        ...old,
        scaleX: 1 / newScale,
        scaleY: 1 / newScale,
        offsetX: groupRef.current.x(),
        offsetY: groupRef.current.y()
      } 
    });
  }

  const OnTouchEnd = () => {
    setLastDist(0);
    setLastCenter(null);
  }

  const OnDragEnd = () => {
    props.updateSizeProps((old) => { return { ...old, offsetX: groupRef.current.x(), offsetY: groupRef.current.y() }});
  }

  const getDistance = (p1:Touch, p2:Touch) => {
    return Math.sqrt(Math.pow(p2.clientX - p1.clientX, 2) + Math.pow(p2.clientY - p1.clientY, 2));
  }

  const getCenter = (p1:Touch, p2:Touch) => {
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
        offsetX={props.imageX}
        offsetY={props.imageY}
        rotation={props.imageRotation}
        image={props.src}
      />
      {holds.map((props, i) => <HoldCircle ref={circleRefs[i]} {...props}/>)}
      {texts.map((props, i) => <HoldText ref={textRefs[i]} {...props}/>)}
    </Group>
  );
};

export const WallImage = forwardRef(WallImageBase)