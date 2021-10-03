import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { Navigator } from 'react-onsenui';
import { createRef, ChangeEvent, useState, useRef, useDebugValue } from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group, Circle, Rect, Image } from 'react-konva';
import { ResizableImage, ResizableImageProps } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';

const PaintPage = ({route, navigator}: {route: any, navigator: Navigator}) => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageHeight, updateStageHeight] = useState<number>(window.innerHeight);
  const [stageWidth, updateStageWidth] = useState<number>(window.innerWidth);
  const [imageHeight, updateImageHeight] = useState<number>(window.innerHeight);
  const [imageWidth, updateImageWidth] = useState<number>(window.innerWidth);
  const [stageX, updateStageX] = useState<number>(0);
  const [stageY, updateStageY] = useState<number>(0);
  const [imageX, updateImgeX] = useState<number>(0);
  const [imageY, updateImageY] = useState<number>(0);
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
      updateImageWidth(i.width);
      updateImageHeight(i.height);
    }
  }

  const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

  const handleExport = async () => {
    if (!stage) return;
    // alert("clicked");

    // return;
    updateTargetVisibility(false);
    updateStageWidth(imageWidth);
    updateStageHeight(imageHeight);
    updateStageX(imageX);
    updateStageY(imageY);

    // alert("state updated");

    // delayをかけないと値が更新される前にダウンロードが走る。
    await sleep(1);
    
    // 長辺の最大値を設定
    const maxSideLength = 600;
    const fixPixelRatio = imageWidth > maxSideLength || imageHeight > maxSideLength;
    const pixelRatio = fixPixelRatio ? maxSideLength / Math.max(imageWidth, imageHeight) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    // alert("ratio calculated");

    downloadURI(uri, "topo.png");

    // alert("downloaded");
    navigator.popPage();
  };

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        offsetX={stageX}
        offsetY={stageY}
        width={stageWidth} 
        height={stageHeight}
        ref={stage}>
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              updateX={updateImgeX}
              updateY={updateImageY}
            />
          </Group>
          <Circle
            fill="#00000000"
            stroke="blue"
            radius={40}
            strokeWidth={5}
            visible={isTargetVisible}
            x={window.innerWidth / 2 - stageX}
            y={window.innerHeight / 2 - stageY}
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