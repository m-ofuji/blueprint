import React, { LegacyRef } from 'react';
import { render } from 'react-dom';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

function Comp() {
  const ref = React.useRef<HTMLDivElement>(null);
  return <div ref={ref}>foo</div>;
}

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }
  :{shapeProps:any, isSelected:boolean, onSelect:KonvaEventObject<MouseEvent>, onChange:any}) => {
  
  // ここを直す
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;

          if (node == null) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};