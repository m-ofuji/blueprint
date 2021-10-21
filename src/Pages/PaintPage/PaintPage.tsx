import ons from 'onsenui'
import { Navigator } from 'react-onsenui';
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
import { CloseButton } from '../../Components/CloseButton';
import { MarkerPositionX, MarkerPositionY } from './Constants';
import { getCurrentTimestamp } from '../../Common/Functions/CurrentTimestamp'; 

export type SizeProps = {
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  width: number,
  height: number,
  imageX?: number,
  imageY?: number,
  imageRotation?: number
}

const PaintPage = ({isLefty, route, navigator}: {isLefty:boolean, route: any, navigator: Navigator}) => {

  const sizeProps = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    width: window.innerWidth,
    height: window.innerHeight,
    imageX: 0,
    imageY: 0,
    imageRotation: 0
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
  const [resizeImage, updateResizeImage] = useState<boolean>(false);

  const initialButton = [
    { key:1, text: 'ホールド', isSelected: selectedButton[0], onTapped: () => activateHoldTarget(0) },
    { key:2, text: 'S・Gホールド', isSelected: selectedButton[1], onTapped: () => activateHoldTarget(1) },
    { key:3, text: 'スタート', isSelected: selectedButton[2], onTapped: () => activateTextTarget(2) },
    { key:4, text: 'ゴール', isSelected: selectedButton[3], onTapped: () => activateTextTarget(3) }
  ];

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  
  const ref = createRef<HTMLInputElement>();

  const selectPicture = () => {
    if (isImageLoaded) return;
    if (ons.platform.isIOS()) {
      if (ref.current) {
        ref.current.click();
      }
    } else {
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
    }
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
      setImageSizeProps((old) => {
        console.log('onload');
        return { 
          ...old,
          centerX: window.innerWidth,
          centerY: window.innerHeight,
          width: i.width,
          height: i.height,
          // imageRotation: 90,
          // imageY: i.height 
        } 
      });
    }
    updateIsImageLoaded(true);
  }

  const download = () => {
    if (!execDownload) return;
    
    const maxSideLength = 800;
    const fixPixelRatio = imageSizeProps.width > maxSideLength || imageSizeProps.height > maxSideLength;
    const pixelRatio = resizeImage && fixPixelRatio ? maxSideLength / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    downloadURI(uri, getCurrentTimestamp() + '.png');

    // setStageSizeProps((old) => {
    //   return {...old,
    //     // x:0,
    //     // y:0,
    //     width: window.innerWidth,
    //     height: window.innerHeight
    //   };
    // });

    // updateExecDownload(false);

    navigator.popPage();
  };

  useEffect(download);

  const onDownloadTapped = () => {
    ons.openActionSheet({
      cancelable: true,
      title: 'トポ画像をダウンロードしますか？',
      buttons: ['ダウンロード', '縮小版をダウンロード', 'キャンセル'],
      
    }).then((idx: any) => {
      console.log(idx);
      if (idx === 0) {
        HandleExport(false);
      } else if (idx === 1) {
        HandleExport(true);
      }
      // const isYes = ons.platform.isIOSSafari() ? idx === 1 : idx === 0;
      // if (!isYes) return;
      // handleExport();
    });

    // ons.notification.alert({
    //   title: 'ダウンロード',
    //   message: 'トポの作成を終了して、画像をダウンロードしますか？',
    //   buttonLabels: ons.platform.isIOSSafari() ? ['いいえ', 'はい'] : ['ダウンロード', '縮小版をダウンロード' ,'いいえ'],
    //   callback: (idx: any) => {
    //     const isYes = ons.platform.isIOSSafari() ? idx === 1 : idx === 0;
    //     // const isYes = idx === 0;
    //     if (!isYes) return; 
    //     handleExport();
    //   }
    // });
  }

  const HandleExport = (resize: boolean) => {
    if (!stage) return;
    console.log('before', imageSizeProps);
    // setImageSizeProps((old) => {
    //   return {...old, 
    //     imageX: 0,
    //     imageY: 0,
    //     imageRotation: 0,
    //   };
    // });
    console.log('after', imageSizeProps);


    setStageSizeProps((old) => {
      console.log('stage', imageSizeProps);

      return {...old,
        width: imageSizeProps.width,
        height: imageSizeProps.height,
        x: imageSizeProps.x,
        y: imageSizeProps.y,
        scaleX: imageSizeProps.scaleX,
        scaleY: imageSizeProps.scaleY,
        // imageRotation: 270
      };
    });

    updateResizeImage(resize);
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

  const onCloseTapped = () => {
    if (isImageLoaded) {
      ons.notification.confirm({
        title: 'トポ作成',
        message: '画面を閉じてもよろしいですか？\n現在編集中の内容は失われます。',
        buttonLabels: ons.platform.isIOSSafari() ? ['いいえ', 'はい'] : ['はい', 'いいえ'],
        callback: (idx: any) => {
          const isYes = ons.platform.isIOSSafari() ? idx === 1 : idx === 0;
          if (isYes) {
            navigator.popPage();
          }
        }
      });
    } else {
      navigator.popPage();
    }
    
  }

  return (
    <Page>
      <Stage 
        className={'image-stage'}
        offsetX={stageSizeProps.x}
        offsetY={stageSizeProps.y}
        scaleX={stageSizeProps.scaleX}
        scaleY={stageSizeProps.scaleY}
        width={stageSizeProps.width} 
        height={stageSizeProps.height}
        ref={stage}
        rotation={stageSizeProps.imageRotation}
      >
        <Layer>
          <Group draggable>
            <WallImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={MarkerPositionX}
              centerY={MarkerPositionY}
              imageX={imageSizeProps.imageX}
              imageY={imageSizeProps.imageY}
              imageRotation={imageSizeProps.imageRotation}
              updateSizeProps={setImageSizeProps}
              updateIsRedoEnabled={useIsRedoEnabled}
              updateIsUndoEnabled={useIsUndoEnabled}
            />
          </Group>
          <NormalTarget
            key={'normalTarget'}
            x={MarkerPositionX - stageSizeProps.x}
            y={MarkerPositionY - stageSizeProps.y}
            isVisible={selectedButton[0] || selectedButton[1]}
            onTapped={holdTargetTapped}
          />
          <TextTarget
            key={'textTarget'}
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

      <div className={isLefty ? 'undo-and-redo-container is-lefty' : 'undo-and-redo-container'}>
        <UndoButton key={'undo'} disabled={isUndoEnabled} onTapped={undo}/>
        <RedoButton key={'redo'} disabled={isRedoEnabled} onTapped={redo}/>
      </div>
      <CloseButton className={isLefty ? 'close-button float-left-top': 'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
      <DownloadButton className={isLefty ? 'download-button is-lefty' : 'download-button'} onTapped={onDownloadTapped}/>

      <input
        key={'file-uploader'}
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