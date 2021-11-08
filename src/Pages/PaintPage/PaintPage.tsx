import ons from 'onsenui'
import EditPage from '../EditPage/EditPage';
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
import { SaveButton } from './Components/SaveButton';
import { UndoButton } from './Components/UndoButton';
import { RedoButton } from './Components/RedoButton';
import { CloseButton } from '../../Components/CloseButton';
import { MarkerPositionX, MarkerPositionY } from './Constants';
import { getCurrentTimestamp } from '../../Common/Functions/CurrentTimestamp'; 
import { IStampButton, IHoldStamp, ITextStamp, isIHoldStamp, isITextStamp } from './StampType';

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

const PaintPage = ({isLefty, route, navigator, updateTopos}: 
  {isLefty:boolean, route: any, navigator: Navigator, updateTopos: () => void}) => {
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
  const [execExport, setExecExport] = useState<boolean>(false);
  const [stamps, setStamps] = useState<IStampButton[]>(initialButton);
  const [outPutMethod, setOutPutMethod] = useState<string>();
  const [holdText, setHoldText] = useState<string>('S');
  const [isUndoEnabled, setIsUndoEnabled] = useState<boolean>(true);
  const [isRedoEnabled, setIsRedoEnabled] = useState<boolean>(true);
  const [resizeImage, setResizeImage] = useState<boolean>(false);
  const [initial, setInitial] = useState<string>('msg');

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  const fileInputRef = createRef<HTMLInputElement>();

  useLayoutEffect(() => { 
    if (wallImage) return;

    if (ons.platform.isIOSSafari() && fileInputRef.current) {
      fileInputRef.current.click();
      return;
    }

    if (initial === 'open') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else if (initial === 'msg') {
      console.log('msg');
      ons.notification.alert({
        title: '壁画像選択',
        message: '壁の画像を選択してください。',
        buttonLabels: ['OK'],
        callback: () => {
          setInitial('open');
        }
      });
    }
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
  }

  const onSaveTapped = () => {
    setOutPutMethod('save');
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
      setOutPutMethod('download');
      HandleExport(resize);
    });
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

    setResizeImage(resize);
    setStamps(old => old.map(x => {return { ...x, isSelected : false }}));
    // setOutPutMethod('download');
    setExecExport(true);
  };

  const output = () => {
    if (!execExport || !outPutMethod) return;

    const maxSideLength = 750;
    const fixPixelRatio = imageSizeProps.width > maxSideLength || imageSizeProps.height > maxSideLength;
    const pixelRatio = resizeImage && fixPixelRatio ? maxSideLength / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    if (outPutMethod === 'download') {
      downloadURI(uri, getCurrentTimestamp() + '.png');
      resetStage();
    } else if (outPutMethod === 'save') {
      openEditPage();
      resetStage();
    }
  };

  const resetStage = () => {
    setExecExport(false);

    setStamps(old => old.map((x, i) => { return {...x, isSelected: i === 1}}));

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
  }

  useEffect(output);

  const activateTarget = (index:number) => {
    setStamps(old => old.map((x,i) => {return { ...x, isSelected : i === index }}));
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
    resizableImage.current.setHoldText(holdText);
  }

  const undo = () => {
    resizableImage.current.Undo();
  }

  const redo = () => {
    resizableImage.current.Redo();
  }

  const onCloseTapped = () => {
    if (wallImage) {
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

  const openEditPage = () => {
    stage.current.toCanvas().toBlob((data: any) => {
      navigator.pushPage({
        comp: EditPage,
        props: {
          key: 'EditPage',
          navigator: navigator,
          imgBlob: data,
          updateTopos: updateTopos
        }
      });
    });
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
              updateIsRedoDisabled={setIsRedoEnabled}
              updateIsUndoDisabled={setIsUndoEnabled}
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
      <SaveButton className={isLefty ? 'save-button is-lefty' : 'save-button'} onTapped={onSaveTapped}/>
      <input
        key={'file-uploader'}
        onChange={onChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type='file'
        accept='image/*'
      />
    </Page>
  )
}

export default PaintPage;