import { group, groupEnd } from 'console';
import React from 'react';
import { Image, Rect, Transformer, Group } from 'react-konva';

export type ResizableImageProps = {
  shapeProps:any;
  isSelected:boolean;
  onSelect:any;
  onChange: any;
  src: CanvasImageSource | undefined
}

export const ResizableImage = ({ shapeProps, isSelected, onSelect, onChange, src } : ResizableImageProps) => {
  // ここを直す
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Group>
      <Image
        image={src}
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
           keepRatio
           enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
};