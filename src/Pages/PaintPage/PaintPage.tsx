import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { Navigator, Segment } from 'react-onsenui';
import { createRef, ChangeEvent, useState, useRef, useEffect, useLayoutEffect} from 'react';
import { Page } from 'react-onsenui';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Group } from 'react-konva';
import { WallImage } from './WallImage';
import { downloadURI } from '../../Common/Functions/DownloadUri';
import { NormalTarget } from './Targets/NormalTarget';
import { TextTarget } from './Targets/TextTarget';
import { RoundButton } from '../../Components/RoundButton';
import { DownloadButton } from './Components/DownloadButton';
import { UndoButton } from './Components/UndoButton';
import { RedoButton } from './Components/RedoButton';
import { MarkerPositionX, MarkerPositionY } from './Constants';

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
    key:'navibar',
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
    height: window.innerHeight - 56
  };

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageSizeProps, setStageSizeProps] = useState<SizeProps>(sizeProps);
  const [imageSizeProps, setImageSizeProps] = useState<SizeProps>(sizeProps);
  const [isImageLoaded, updateIsImageLoaded] = useState<boolean>(false);
  const [execDownload, updateExecDownload] = useState<boolean>(false);
  const [selectedButton, updateSelectedButton] = useState<boolean[]>([true, false, false, false]);
  const [holdText, setHoldText] = useState<string>('S');
  const [isUndoEnabled, useIsUndoEnabled] = useState<boolean>(true);
  const [isRedoEnabled, useIsRedoEnabled] = useState<boolean>(true);

  const initialButton = [
    { key:1, text: 'ホールド', isSelected: selectedButton[0], onTapped: () => activateHoldTarget(0) },
    { key:2, text: 'S・Gホールド', isSelected: selectedButton[1], onTapped: () => activateHoldTarget(1) },
    { key:3, text: 'Sマーク', isSelected: selectedButton[2], onTapped: () => activateTextTarget(2) },
    { key:4, text: 'Gマーク', isSelected: selectedButton[3], onTapped: () => activateTextTarget(3) }
  ];

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  
  const ref = createRef<HTMLInputElement>();

  const selectPicture = () => {
    if (isImageLoaded) return;
    ons.notification.confirm({
      title: '壁画像選択',
      message: '壁の画像を選択してください。',
      buttonLabels: ['OK'],
      callback: () => {
        if (ref.current) {
          ref.current.click();
        }
      }
    });
  };

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

  const onDownloadTapped = () => {
    ons.notification.confirm({
      title: 'ダウンロード',
      message: 'トポの作成を終了して、画像をダウンロードしますか？',
      buttonLabels: ['はい', 'いいえ'],
      callback: (idx: any) => {
        if (idx === 1) return; 
        handleExport();
      }
    });
  }

  const handleExport = () => {
    if (!stage) return;

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
    updateSelectedButton([false, false, false, false]);

    updateExecDownload(true);
  };

  const activateHoldTarget = (index:number) => {
    const selected = [false, false, false, false];
    selected[index] = true;
    updateSelectedButton(selected);
  }

  const activateTextTarget = (index:number) => {
    const selected = [false, false, false, false];
    selected[index] = true;
    updateSelectedButton(selected);
    const text = getText(selected);
    if (!text) return;
    setHoldText(text);
  }

  const getHoldColor = (selected: boolean[]) => {
    const index = selected.findIndex((val, i) => val);
    if (index >= 2 || index < 0) return undefined;
    return index === 0 ? 'yellow' : 'red';
  }

  const getText = (selected: boolean[]) => {
    const index = selected.findIndex((val, i) => val);
    if (index <= 1) return undefined;
    return index === 2 ? 'S' : 'G';
  }

  const holdTargetTapped = (evt: KonvaEventObject<Event>) => {
    const color = getHoldColor(selectedButton);
    if (!color) return;
    resizableImage.current.useHold(color)
  }

  const textTargetTapped = (evt: KonvaEventObject<Event>) => {
    const text = getText(selectedButton);
    if (!text) return;
    resizableImage.current.useHoldText(text)
  }

  const undo = () => {
    resizableImage.current.Undo();
  }

  const redo = () => {
    resizableImage.current.Redo();
  }

  return (
    <Page 
      renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        className={'image-stage'}
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
            <WallImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={MarkerPositionX}
              centerY={MarkerPositionY}
              updateSizeProps={setImageSizeProps}
              updateIsRedoEnabled={useIsRedoEnabled}
              updateIsUndoEnabled={useIsUndoEnabled}
            />
          </Group>
          <NormalTarget
            x={MarkerPositionX - stageSizeProps.x}
            y={MarkerPositionY - stageSizeProps.y}
            // y={MarkerPositionY}
            isVisible={selectedButton[0] || selectedButton[1]}
            onTapped={holdTargetTapped}
          />
          <TextTarget
            x={MarkerPositionX - stageSizeProps.x}
            y={MarkerPositionY - stageSizeProps.y}
            character={holdText}
            isVisible={selectedButton[2] || selectedButton[3]}
            onTapped={textTargetTapped}
          />
        </Layer>
      </Stage>
      <div className={'horizontal-container'}>
        {initialButton.map((props, i) => <RoundButton {...props}/>)}
      </div>
      <div className={'undo-and-redo-container'}>
        <UndoButton key={'undo'} disabled={isUndoEnabled} onTapped={undo}/>
        <RedoButton key={'redo'} disabled={isRedoEnabled} onTapped={redo}/>
      </div>
      <DownloadButton key={'download'} onTapped={onDownloadTapped}/>

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