import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState, useRef } from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { NormalHoldCircle, NormalHoldCircleProps } from './NormalHoldCircle';
import { ResizableImage } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';
import { JsxAttributeLike } from 'typescript';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const [wallImage, updatewallImage] = useState<CanvasImageSource>(new window.Image());
  const [wallImageHeight, updatewallImageHeight] = useState<number>(0);
  // const [images, setImages] = useState<number[] | null>([]);
  const [normalHolds, setNormalHolds] = useState<NormalHoldCircleProps[] | null>([]);
  const stage = useRef<any>(null);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [rectangles, setRectangles] = useState<any>(null);
  const ref = createRef<HTMLInputElement>();

  let initialRectangles = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: wallImage.width,
    height: wallImage.height,
    id: 'rect1',
  };

  let count = 0;

  const selectPicture = () => {
    const option = {
      title:'壁画像選択', buttonLabels:['いいえ','はい']
    }
    ons.notification.confirm('壁の画像を選択してください。', {}).then(onAlertClose);
  }

  const onAlertClose = (index: HTMLElement) => {
    if (ref.current) {
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
    updatewallImage(i);
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
    console.log(stage);
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
            <Rect
              fill={'#ffffff'}
              x={500}
              y={500}
              width={500}
              height={500}
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
              src={wallImage}
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
            {normalHolds?.map((props, i) => <NormalHoldCircle {...props} />)}
            {/* {images.map()} */}
          </Group>
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