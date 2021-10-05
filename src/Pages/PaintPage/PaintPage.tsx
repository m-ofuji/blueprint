import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { Navigator } from 'react-onsenui';
import { createRef, ChangeEvent, useState, useRef, useDebugValue } from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group, Circle, Rect, Image } from 'react-konva';
import { ResizableImage, ResizableImageProps } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';
import { NormalTarget } from './Targets/NormalTarget';

export type SizeProps = {
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  width: number,
  height: number
}

const PaintPage = ({route, navigator}: {route: any, navigator: Navigator}) => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const sizeProps = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    width: window.innerWidth,
    height: window.innerHeight
  };

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageSizeProps, setStageSizeProps] = useState<SizeProps>(sizeProps);
  const [imageSizeProps, setImageSizeProps] = useState<SizeProps>(sizeProps);


  // const [stageHeight, updateStageHeight] = useState<number>(window.innerHeight);
  // const [stageWidth, updateStageWidth] = useState<number>(window.innerWidth);
  // const [imageHeight, updateImageHeight] = useState<number>(window.innerHeight);
  // const [imageWidth, updateImageWidth] = useState<number>(window.innerWidth);
  // const [stageX, updateStageX] = useState<number>(0);
  // const [stageY, updateStageY] = useState<number>(0);
  // const [imageX, updateImgeX] = useState<number>(0);
  // const [imageY, updateImageY] = useState<number>(0);
  // const [stageScaleX, updateStageScaleX] = useState<number>(1);
  // const [stageScaleY, updateStageScaleY] = useState<number>(1);
  // const [imageScaleX, updateImageScaleX] = useState<number>(1);
  // const [imageScaleY, updateImageScaleY] = useState<number>(1);
  const [isTargetVisible, updateTargetVisibility] = useState<boolean>(true);

  const stage = useRef<any>(null);
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
    i.onload = (evt) => {
      setImageSizeProps({...imageSizeProps, ...{width: i.width, height: i.height}});
      // updateImageWidth(i.width);
      // updateImageHeight(i.height);
    }
  }

  const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

  const handleExport = async () => {
    if (!stage) return;

    updateTargetVisibility(false);
    setStageSizeProps({...stageSizeProps, ...{
      width: imageSizeProps.width,
      height: imageSizeProps.height,
      x: imageSizeProps.x,
      y: imageSizeProps.y,
      scaleX: imageSizeProps.scaleX,
      scaleY: imageSizeProps.scaleY
    }});
    
    // delayをかけないと値が更新される前にダウンロードが走る。
    await sleep(1);
    
    // 長辺の最大値を設定
    const maxSideLength = 600;
    const fixPixelRatio = imageSizeProps.width > maxSideLength || imageSizeProps.height > maxSideLength;
    const pixelRatio = fixPixelRatio ? maxSideLength / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    downloadURI(uri, "topo.png");

    navigator.popPage();
  };

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        offsetX={stageSizeProps.x}
        offsetY={stageSizeProps.y}
        scaleX={stageSizeProps.scaleX}
        scaleY={stageSizeProps.scaleY}
        width={stageSizeProps.width} 
        height={stageSizeProps.height}
        ref={stage}>
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              sizeProps={imageSizeProps}
              updateSizeProps={setImageSizeProps}
              // updateX={setImageSizeProps}
              // updateY={updateImageY}
              // updateScaleX={updateImageScaleX}
              // updateScaleY={updateImageScaleY}
            />
          </Group>
          <NormalTarget
            x={window.innerWidth / 2 - stageSizeProps.x}
            y={window.innerHeight / 2 - stageSizeProps.y}
            isVisible={isTargetVisible}
            onTapped={() => resizableImage.current.useHold()}
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