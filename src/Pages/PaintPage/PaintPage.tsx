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
import { IStampButton, IHoldStamp, ITextStamp, isIHoldStamp, isITextStamp } from './StampType';
import { TopoDb } from '../../DB/NavBar';

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

  const initialButton = [
    { key:1, label: 'S・Gホールド', isSelected: true,  onTapped: () => activateTarget(0), color: '#ff3838' },
    { key:2, label: 'ホールド',     isSelected: false, onTapped: () => activateTarget(1), color: '#ffff56' },
    { key:3, label: 'スタート',     isSelected: false, onTapped: () => activateTextTarget(2), contentText: 'S' },
    { key:4, label: 'ゴール',       isSelected: false, onTapped: () => activateTextTarget(3), contentText: 'G' },
    { key:5, label: 'スタート右',   isSelected: false, onTapped: () => activateTextTarget(4), contentText: 'S右' },
    { key:6, label: 'スタート左',   isSelected: false, onTapped: () => activateTextTarget(5), contentText: 'S左' },
    { key:7, label: 'カンテ',       isSelected: false, onTapped: () => activateTextTarget(6), contentText: 'カンテ' },
    { key:8, label: 'ハリボテ',     isSelected: false, onTapped: () => activateTextTarget(7), contentText: 'ボテあり' }
  ];

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageSizeProps, setStageSizeProps] = useState<SizeProps>(sizeProps);
  const [imageSizeProps, setImageSizeProps] = useState<SizeProps>(sizeProps);
  const [isImageLoaded, updateIsImageLoaded] = useState<boolean>(false);
  const [execExport, updateExecExport] = useState<boolean>(false);
  const [stamps, updateStamps] = useState<IStampButton[]>(initialButton);
  const [outPutMethod, updateOutPutMethod] = useState<string>();
  const [holdText, setHoldText] = useState<string>('S');
  const [isUndoEnabled, useIsUndoEnabled] = useState<boolean>(true);
  const [isRedoEnabled, useIsRedoEnabled] = useState<boolean>(true);
  const [resizeImage, updateResizeImage] = useState<boolean>(false);

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  
  const ref = createRef<HTMLInputElement>();

  const selectPicture = () => {
    if (isImageLoaded) return;
    // ons.notification.confirm({
    //   title: '壁画像選択',
    //   message: '壁の画像を選択してください。',
    //   buttonLabels: ['OK'],
    //   callback: () => {
    //     if (ref.current) {
    //       ref.current.click();
    //     }
    //   }
    // });

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

  const onSaveTapped = () => {
    updateOutPutMethod('save');
    HandleExport(false);
  }

  const onDownloadTapped = () => {
    ons.openActionSheet({
      cancelable: true,
      title: 'トポ画像をダウンロードしますか？',
      buttons: ['ダウンロード', '縮小版をダウンロード', 'キャンセル'],
    }).then((idx: any) => {
      if (idx !== 1 && idx !== 0) return;
      const resize = idx === 1;
      updateOutPutMethod('download');
      HandleExport(resize);
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
    // setImageSizeProps((old) => {
    //   return {...old, 
    //     imageX: 0,
    //     imageY: 0,
    //     imageRotation: 0,
    //   };
    // });
    setStageSizeProps((old) => {
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
    updateStamps(old => old.map(x => {return { ...x, isSelected : false }}));
    // updateOutPutMethod('download');
    updateExecExport(true);
  };

  const output = () => {
    if (!execExport || !outPutMethod) return;

    const maxSideLength = 750;
    const fixPixelRatio = imageSizeProps.width > maxSideLength || imageSizeProps.height > maxSideLength;
    const pixelRatio = resizeImage && fixPixelRatio ? maxSideLength / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    if (outPutMethod === 'download') {
      downloadURI(uri, getCurrentTimestamp() + '.png');
    } else if (outPutMethod === 'save') {
      const db = new TopoDb();
      stage.current.toCanvas({pixelRatio: pixelRatio}).toBlob((result: string) => {
        db.TopoImages.put({data: result});
      });
    }

    updateStamps(old => old.map((x, i) => { return {...x, isSelected: i === 1}}));

    setStageSizeProps((old) => {
      return {...old,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        width: window.innerWidth,
        height: window.innerHeight
      };
    });

    updateExecExport(false);
  };

  useEffect(output);

  const activateTarget = (index:number) => {
    updateStamps(old => old.map((x,i) => {return { ...x, isSelected : i === index }}));
  }

  const activateTextTarget = (index: number) => {
    activateTarget(index);
    const selected = stamps[index];
    if (!isITextStamp(selected)) return;
    setHoldText((selected as ITextStamp).contentText);
  }

  const holdTargetTapped = (evt: KonvaEventObject<Event>) => {
    const selected = stamps.find(x => x.isSelected);
    if (!isIHoldStamp(selected)) return;
    resizableImage.current.useHold((selected as IHoldStamp).color)
  }

  const textTargetTapped = (evt: KonvaEventObject<Event>) => {
    resizableImage.current.useHoldText(holdText);
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
        key={'stage'}
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
              updateIsRedoDisabled={useIsRedoEnabled}
              updateIsUndoDisabled={useIsUndoEnabled}
            />
          </Group>
          <NormalTarget
            key={'normalTarget'}
            x={MarkerPositionX - stageSizeProps.x}
            y={MarkerPositionY - stageSizeProps.y}
            isVisible={stamps.filter(x => isIHoldStamp(x) && x.isSelected).length > 0}
            onTapped={holdTargetTapped}
          />
          <TextTarget
            key={'textTarget'}
            x={MarkerPositionX - stageSizeProps.x}
            y={MarkerPositionY - stageSizeProps.y}
            character={holdText}
            isVisible={stamps.filter(x => isITextStamp(x) && x.isSelected).length > 0}
            onTapped={textTargetTapped}
          />
        </Layer>
      </Stage>
      <div className={'horizontal-container'}>
        {stamps.map((props, i) => <RoundButton {...props}/>)}
      </div>

      <div className={isLefty ? 'undo-and-redo-container is-lefty' : 'undo-and-redo-container'}>
        <UndoButton key={'undo'} disabled={isUndoEnabled} onTapped={undo}/>
        <RedoButton key={'redo'} disabled={isRedoEnabled} onTapped={redo}/>
      </div>
      <CloseButton className={isLefty ? 'close-button float-left-top': 'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
      <DownloadButton className={isLefty ? 'download-button is-lefty' : 'download-button'} onTapped={onDownloadTapped}/>
      <DownloadButton className={isLefty ? 'download-button' : 'download-button is-lefty'} onTapped={onSaveTapped}/>
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