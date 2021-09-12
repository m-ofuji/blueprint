import React, { LegacyRef } from 'react';
import { render } from 'react-dom';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Rect, Transformer } from 'react-konva';

class RctParam {
  shapeProps:any;
  isSelected:boolean = false;
  onSelect:any;
  onChange: any;
}

const ResizableRectangle = ({ shapeProps, isSelected, onSelect, onChange } :RctParam) => {
  
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
          const node = shapeRef.current;

          if (node == null) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
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

export default ResizableRectangle;