import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState, useRef } from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group, Rect, Image } from 'react-konva';
import { NormalHoldCircle, NormalHoldCircleProps } from './NormalHoldCircle';
import { ResizableImage, ResizableImageProps } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';
import { JsxAttributeLike } from 'typescript';
import Konva from 'konva';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [wallImageHeight, updatewallImageHeight] = useState<number>(0);
  const [normalHolds, setNormalHolds] = useState<NormalHoldCircleProps[] | null>([]);
  // const [resizableImages, setResizableImages] = useState<ResizableImageProps[]>([]);
  const stage = useRef<any>(null);
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

    // if (wallImage === null) return;
    console.log(wallImage);
    // setResizableImages([{
    //   src: i ?? undefined,
    //   shapeProps: rectangles,
    //   isSelected : 'rect1' === selectedId,
    //   onSelect: () => selectShape(initialRectangles.id),
    //   onChange: (newAttrs: any) => {
    //     initialRectangles = newAttrs;
    //     setRectangles(initialRectangles);
    //   }
    // }]);
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
            <Rect
              fill={'#ffffff'}
              x={800}
              y={500}
              width={500}
              height={500}
            />
            <Image 
              x={500}
              y={500}
              image={imagesource}
            />
            <Rect
              fill={'#000000'}
              x={600}
              y={600}
              width={50}
              height={50}
            />
            <Rect
              fill={'#000000'}
              x={700}
              y={700}
              width={50}
              height={50}
            />
          </Group>
          <Group draggable>
            <ResizableImage
              src={wallImage ?? undefined}
              key={'wallImage'}
              shapeProps={rectangles}
              isSelected={'rect1' === selectedId}
              onSelect={() => {
                selectShape(initialRectangles.id);
              }}
              onChange={(newAttrs: any) => {
                initialRectangles = newAttrs;
                setRectangles(initialRectangles);
              }}
            />
            {/* {<ResizableImage {...resizableImage} />} */}
            {/* {resizableImages?.map((props, i) => <ResizableImage key={'a'} {...props} />)} */}
            {normalHolds?.map((props, i) => <NormalHoldCircle {...props} />)}
          </Group>
          {/* {normalHolds?.map((props, i) => <NormalHoldCircle {...props} />)} */}
        </Layer>
      </Stage>
      <HoldFloatMenu
        position={'bottom right'}
        onNormalClick={() => setNormalHolds((i) => normalHolds?.concat([{key:normalHolds.length++}]) ?? null)}
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