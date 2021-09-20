import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState, useRef } from 'react';
import { Button, Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group, Circle, Rect, Image } from 'react-konva';
import { NormalHoldCircle, NormalHoldCircleProps } from './NormalHoldCircle';
import { ResizableImage, ResizableImageProps } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';
import { ModuleResolutionKind } from 'typescript';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [wallImageHeight, updatewallImageHeight] = useState<number>(0);
  // const [normalHolds, setNormalHolds] = useState<NormalHoldCircleProps[] | null>([]);
  // const [resizableImages, setResizableImages] = useState<ResizableImageProps[]>([]);
  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  // const [holdCircle, useHoldCircle] = useState<JSX.Element | null>(null);
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

  const imagesource = new window.Image(); 
  imagesource.src = 'https://konvajs.org/assets/lion.png';
  imagesource.width=500;
  imagesource.height=500;

  const holdCirclePotision = {
    keyNum:0,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }

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
              isSelected={'rect1' === selectedId}
              onSelect={() => selectShape(initialRectangles.id)}
              onChange={(newAttrs: any) => {
                initialRectangles = newAttrs;
                setRectangles(initialRectangles);
              }}
            />
            {/* <Circle
              fill="#00000000"
              stroke="blue"
              radius={40}
              strokeWidth={5}
              x={window.innerWidth / 2}
              y={window.innerHeight / 2}
              draggable={false}
            /> */}
            {/* {<ResizableImage {...resizableImage} />} */}
            {/* {resizableImages?.map((props, i) => <ResizableImage key={'a'} {...props} />)} */}
            {/* {normalHolds?.map((props, i) => <NormalHoldCircle {...props} />)} */}
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
          {/* {normalHolds?.map((props, i) => <NormalHoldCircle {...props} />)} */}
        </Layer>
      </Stage>
      {/* <div className={'button-center'}>
        <Button 
          modifier='material'
          onClick={() => {
            if (normalHolds === null) return;
            resizableImage.current.useHold(normalHolds[normalHolds.length - 1]);
          }}>
          決定
        </Button>
      </div> */}
      <HoldFloatMenu
        position={'bottom right'}
        // onNormalClick={() => setNormalHolds(i => normalHolds?.concat([{keyNum:i?.length ?? 0, ...holdCirclePotision}]) ?? null)}
        // onNormalClick={() => setNormalHolds(i => normalHolds?.concat([holdCirclePotision]) ?? null)}
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