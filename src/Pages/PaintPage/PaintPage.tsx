import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { Navigator } from 'react-onsenui';
import { createRef, ChangeEvent, useState, useRef, useEffect, useLayoutEffect} from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { Stage, Layer, Group } from 'react-konva';
import { ResizableImage } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';
import { NormalTarget } from './Targets/NormalTarget';
import { TextTarget } from './Targets/TextTarget';

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
  const [isImageLoaded, updateIsImageLoaded] = useState<boolean>(false);
  const [execDownload, updateExecDownload] = useState<boolean>(false);
  const [circleColor, setCircleColor] = useState<string>('yellow');
  const [isHoldTargetVisible, updateHoldTargetVisibility] = useState<boolean>(true);
  const [holdText, setHoldText] = useState<string>('S');
  const [isTextTargetVisible, updateTextTargetVisibility] = useState<boolean>(false);

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  
  const ref = createRef<HTMLInputElement>();

  const selectPicture = () => {
    if (ref.current && !isImageLoaded) {
      ref.current.click();
    }

    // const option = {
    //   title:'壁画像選択', buttonLabels:['OK']
    // }
    // ons.notification.confirm('壁の画像を選択してください。', option).then(onAlertClose);
  }

  const onAlertClose = (index: HTMLElement) => {
    if (ref.current) {
      ref.current.click();
    }
  }

  useLayoutEffect(()=> {
    selectPicture();
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files.item(0);

    if (file === null) return;

    const dataURL = URL.createObjectURL(file);
    const i = new window.Image();
    i.src = dataURL;
    setWallImage(i);
    i.onload = (evt) => {
      setImageSizeProps((old) => { return { ...old, width: i.width, height: i.height } });
    }
    updateIsImageLoaded(true);
  }

  const download = () => {
    if (!execDownload) return;
    const maxSideLength = 600;
    const fixPixelRatio = imageSizeProps.width > maxSideLength || imageSizeProps.height > maxSideLength;
    const pixelRatio = fixPixelRatio ? maxSideLength / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    downloadURI(uri, "topo.png");

    navigator.popPage();
  };

  useEffect(download);

  const handleExport = () => {
    if (!stage) return;

    updateHoldTargetVisibility(false);
    updateTextTargetVisibility(false);

    setStageSizeProps((old) => {
      return {...old, 
        width: imageSizeProps.width,
        height: imageSizeProps.height,
        x: imageSizeProps.x,
        y: imageSizeProps.y,
        scaleX: imageSizeProps.scaleX,
        scaleY: imageSizeProps.scaleY
      };
    });

    updateExecDownload(true);
  };

  const activateHoldTarget = (color: string) => {
    updateHoldTargetVisibility(true);
    updateTextTargetVisibility(false);
    setCircleColor(color);
  }

  const activateTextTarget = (holdText: string) => {
    updateHoldTargetVisibility(false);
    updateTextTargetVisibility(true);
    setHoldText(holdText);
  }

  return (
    <Page 
      // onShow={selectPicture} 
      renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        offsetX={stageSizeProps.x}
        offsetY={stageSizeProps.y}
        scaleX={stageSizeProps.scaleX}
        scaleY={stageSizeProps.scaleY}
        width={stageSizeProps.width} 
        height={stageSizeProps.height}
        ref={stage}
      >
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              updateSizeProps={setImageSizeProps}
            />
          </Group>
          <NormalTarget
            x={window.innerWidth / 2 - stageSizeProps.x}
            y={window.innerHeight / 2 - stageSizeProps.y}
            isVisible={isHoldTargetVisible}
            onTapped={() => resizableImage.current.useHold(circleColor)}
          />
          <TextTarget
            x={window.innerWidth / 2 - stageSizeProps.x}
            y={window.innerHeight / 2 - stageSizeProps.y}
            character={holdText}
            isVisible={isTextTargetVisible}
            onTapped={() => resizableImage.current.useHoldText(holdText)}
          />
        </Layer>
      </Stage>
      <HoldFloatMenu
        position={'bottom right'}
        onNormalClick={() => activateHoldTarget('yellow')}
        onSpecialClick={() => activateHoldTarget('red')}
        onStartClick={() => activateTextTarget('S')}
        onGoalClick={() => activateTextTarget('G')}
      />
      <Fab onClick={handleExport} position={'bottom left'}>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      
        <input
          onChange={onChange}
          ref={ref}
          style={{ display: 'none' }}
          type='file'
          accept='image/*'
        />
    </Page>
  )
}

export default PaintPage;