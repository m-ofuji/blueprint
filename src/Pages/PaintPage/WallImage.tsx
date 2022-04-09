import React, { useEffect, useState } from 'react';
import { Image, Group } from 'react-konva';
import { HoldCircleProps, HoldCircle } from './Holds/HoldCircle';
import { HoldTextProps, HoldText } from './Holds/HoldText';
import { useImperativeHandle, forwardRef } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { WallImageProps } from '../../Types/WallImageProps';
import { MarkerPositionX, MarkerPositionY } from './Constants';

let WallImageBase = (props : WallImageProps, ref : any) => {

  const groupRef = React.useRef<any>();
  const [holds, setHolds] = useState<HoldCircleProps[]>([]);
  const [texts, setHoldText] = useState<HoldTextProps[]>([]);
  const [scale, setScale] = useState(1);
  const [lastDist, setLastDist] = useState(0);
  const [lastCenter, setLastCenter] = useState<{x: number, y: number} | null>(null);
  const [stampKeys, setStampKeys] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  const onCirleDoubleTapped = (id: number) => {
    setHolds(old => old.filter(x => x.id !== id ));
  }

  const onTextDoubleTapped = (id: number) => {
    setHoldText(old => old.filter(x => x.id !== id ));
  }

  useImperativeHandle(ref, () => ({
    addCircle: (color: string) => {
      setStampKeys(stampKeys + 1);
      const normalHold = {
        id: stampKeys,
        keyStr: stampKeys.toString(),
        x: (MarkerPositionX - (groupRef.current.x())) * (1 / scale),
        y: (MarkerPositionY - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale,
        color: color,
        onDoubleTapped: onCirleDoubleTapped
      }
      setHolds(holds.concat(normalHold));
    },
    addText: (text: string, fontSize: number, color: string) => {
      setStampKeys(stampKeys + 1);
      const t = {
        id: stampKeys,
        keyStr: stampKeys.toString(),
        x: (MarkerPositionX - (groupRef.current.x())) * (1 / scale),
        y: (MarkerPositionY - (groupRef.current.y())) * (1 / scale),
        scale: 1 / scale,
        character:text,
        fontSize: fontSize,
        color: color,
        onDoubleTapped: onTextDoubleTapped
      }
      setHoldText(texts.concat(t).filter(x => x));
    },
    rotate: () => {
      setRotation(old => old + 90);
      const angle = ((rotation + 90) / 90) % 4;
      let newX = props.imageX ?? 0;
      let newY = props.imageY ?? 0;

      if (angle === 1) {
        newX = Number(props.src?.height);
      } else if (angle === 2) {
        newX = Number(props.src?.width);
        newY = Number(props.src?.height);
      } else if (angle === 3) {
        newY = Number(props.src?.width);
      }

      setX(newX);
      setY(newY);
    }
  }));

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
        x={x}
        y={y}
        rotation={rotation}
        image={props.src}
      />
      {holds.map((props, i) => <HoldCircle key={i} {...props}/>)}
      {texts.map((props, i) => <HoldText key={i} {...props}/>)}
    </Group>
  );
};

export const WallImage = forwardRef(WallImageBase)