import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState, useRef, useDebugValue } from 'react';
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
  const [dWallImage, setDWallImage] = useState<CanvasImageSource | null>(null);
  const [stageHeight, updateStageHeight] = useState<number>(window.innerHeight);
  const [stageWidth, updateStageWidth] = useState<number>(window.innerWidth);
  const [stageX, updateStageX] = useState<number>(0);
  const [stageY, updateStageY] = useState<number>(0);

  const stage = useRef<any>(null);
  const dsref = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  
  const ref = createRef<HTMLInputElement>();

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
      console.log(resizableImage.current);
      updateStageWidth(i.naturalWidth);
      updateStageHeight(i.naturalHeight);
      // updatewallImageHeight(window.innerWidth * (i.naturalHeight / i.naturalWidth));
      // updateStageWidth(resizableImage.current.width);
      // updateStageHeight(resizableImage.current.height);
    }
  }

  const handleExport = () => {
    // console.log(resizableImage.current);
    if (!stage || !resizableImage) return;
    // const isWidthLonger = resizableImage.current.width > resizableImage.current.height;
    // // const imageWidth = resizableImage.current.naturalWidth;
    // // const imageHeight = resizableImage.current.naturalHeight;
    // const ratio = resizableImage.current.width / resizableImage.current.height;
    // const w = isWidthLonger ? 100 : window.innerHeight * ratio;
    // const h = isWidthLonger ? window.innerWidth * (1 / ratio) : 100;

    // console.log(resizableImage);
    // console.log(resizableImage.current);

    // console.log(isWidthLonger);
    // console.log(ratio);
    // console.log(w);
    // console.log(h);

    // return;

    // updateStageWidth(w);
    // updateStageHeight(h);
    setDWallImage(wallImage);
    const uri = stage.current.toDataURL();
    downloadURI(uri, "topo.png")
  };

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        // x={stageX}
        // y={stageY}
        width={window.innerWidth} 
        height={window.innerWidth} 
        ref={stage}>
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              updateX={updateStageX}
              updateY={updateStageY}
              updateHeight={updateStageHeight}
              updateWidth={updateStageWidth}
              // height={wallImageWidth}
              // width={wallImageWidth}
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
      {/* <Stage 
        width={window.innerWidth} 
        height={window.innerHeight} 
        ref={stage}>
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              updateHeight={updateStageHeight}
              updateWidth={updateStageWidth}
              // height={wallImageWidth}
              // width={wallImageWidth}
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
      </Stage> */}
    </Page>
  )
}

export default PaintPage;