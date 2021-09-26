import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState, useRef } from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group, Circle, Rect, Image } from 'react-konva';
import { ResizableImage, ResizableImageProps } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [wallImageHeight, updatewallImageHeight] = useState<number>(0);
  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [rectangles, setRectangles] = useState<any>(null);
  const ref = createRef<HTMLInputElement>();

  let initialRectangles = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: wallImage?.width,
    height: wallImage?.height,
    id: 'rect1',
  };

  const selectPicture = () => {
    const option = {
      title:'壁画像選択', buttonLabels:['いいえ','はい']
    }
    ons.notification.confirm('壁の画像を選択してください。', option).then(onAlertClose);
  }

  const onAlertClose = (index: HTMLElement) => {
    if (ref.current && Number(index) === 1) {
      ref.current.click()
    }
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files.item(0)

    if (file === null) return;

    const dataURL = URL.createObjectURL(file);
    const i = new window.Image();
    i.src = dataURL;
    setWallImage(i);
    i.onload = () => {
      updatewallImageHeight(window.innerWidth * (i.naturalHeight / i.naturalWidth));  
    }
  }

  const checkDeselect = (e:any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleExport = () => {
    if (stage == null) return;

    const uri = stage.current.toDataURL();
    downloadURI(uri, "topo.png")
  };

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        onMouseDown={checkDeselect} 
        onTouchStart={checkDeselect}
        ref={stage}>
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              shapeProps={rectangles}
              isSelected={true}
              onSelect={() => selectShape(initialRectangles.id)}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              onChange={(newAttrs: any) => {
                initialRectangles = newAttrs;
                setRectangles(initialRectangles);
              }}
            />
          </Group>
          <Circle
            fill="#00000000"
            stroke="blue"
            radius={40}
            strokeWidth={5}
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            draggable={false}
          />
        </Layer>
      </Stage>
      <HoldFloatMenu
        position={'bottom right'}
        onNormalClick={() => resizableImage.current.useHold()}
        onFootClick={() => {}}
        onStartClick={() => {}}
        onGoalClick={() => {}}
      />
      <Fab onClick={handleExport} position={'bottom left'}>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <input
        onChange={onChange}
        ref={ref}
        style={{ display: 'none' }}
        type={'file'}
      />
    </Page>
  )
}

export default PaintPage;