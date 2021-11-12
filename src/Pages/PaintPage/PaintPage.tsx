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
import { IStampButton, IHoldStamp, ITextStamp, isIHoldStamp, isITextStamp } from '../../Types/StampType';
import { SizeProps } from '../../Types/SizeProps';

const PaintPage = ({isLefty, route, navigator, updateTopos}: 
  {isLefty:boolean, route: any, navigator: Navigator, updateTopos: () => void}) => {
    
    const MAX_SIDE_LENGTH = 750;
  
    const sizeProps = {
    offsetX: 0,
    offsetY: 0,
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
  const [stamps, setStamps] = useState<IStampButton[]>(initialButton);
  const [holdText, setHoldText] = useState<string>('S');
  const [isUndoEnabled, setIsUndoEnabled] = useState<boolean>(true);
  const [isRedoEnabled, setIsRedoEnabled] = useState<boolean>(true);
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

  // 保存
  const onSaveTapped = async () => {
    // todo なぜawaitするとうまくリサイズされるのか
    await resizeStageToImageSize();

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

    resetStage();
  }

  // ダウンロード
  const onDownloadTapped = () => {
    ons.openActionSheet({
      cancelable: true,
      title: 'トポ画像をダウンロードしますか？',
      buttons: ['ダウンロード', '縮小版をダウンロード', 'キャンセル'],
    }).then((idx: any) => {
      if (idx !== 1 && idx !== 0) return;
      const resize = idx === 1;
      download(resize);
    });
  }

  const download = (resize: boolean) => {
    if (!stage) return;

    resizeStageToImageSize();
    const fixPixelRatio = imageSizeProps.width > MAX_SIDE_LENGTH || imageSizeProps.height > MAX_SIDE_LENGTH;
    const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});
    downloadURI(uri, getCurrentTimestamp() + '.png');
    resetStage();
  }

  const resizeStageToImageSize = () => {
    setStageSizeProps(old => {return {...old, ...imageSizeProps}});
    setStamps(old => old.map(x => {return { ...x, isSelected : false }}));
  }

  const resetStage = () => {
    setStamps(old => old.map((x, i) => { return {...x, isSelected: i === 1}}));
    setStageSizeProps((old) => {
      return {...old,
        offsetX: 0,
        offsetY: 0,
        scaleX: 1,
        scaleY: 1,
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
  }

  const activateTarget = (index: number) => {
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
    resizableImage.current.addCircle((selected as IHoldStamp).color)
  }

  const textTargetTapped = (evt: KonvaEventObject<Event>) => {
    resizableImage.current.addText(holdText);
  }

  const undo = () => {
    resizableImage.current.undo();
  }

  const redo = () => {
    resizableImage.current.redo();
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


  return (
    <Page>
      <Stage 
        key={'stage'}
        className={'image-stage'}
        {...stageSizeProps}
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
            x={MarkerPositionX - stageSizeProps.offsetX}
            y={MarkerPositionY - stageSizeProps.offsetY}
            isVisible={stamps.filter(x => isIHoldStamp(x) && x.isSelected).length > 0}
            onTapped={holdTargetTapped}
          />
          <TextTarget
            key={'textTarget'}
            x={MarkerPositionX - stageSizeProps.offsetX}
            y={MarkerPositionY - stageSizeProps.offsetY}
            character={holdText}
            isVisible={stamps.filter(x => isITextStamp(x) && x.isSelected).length > 0}
            onTapped={textTargetTapped}
          />
        </Layer>
      </Stage>
      <div className={'horizontal-container'}>
        {stamps.map((props, i) => <RoundButton {...props}/>)}
      </div>
      <CloseButton className={`close-button ${isLefty ? 'float-left-top': 'float-right-top' }`} onTapped={onCloseTapped}></CloseButton>
      <DownloadButton className={`download-button${isLefty ? ' is-lefty' : ''}`} onTapped={onDownloadTapped}/>
      <SaveButton className={`save-button${isLefty ? ' is-lefty' : ''}`} onTapped={onSaveTapped}/>
      <div className={`undo-and-redo-container${isLefty ? ' is-lefty' : ''}`}>
        <UndoButton key={'undo'} disabled={isUndoEnabled} onTapped={undo}/>
        <RedoButton key={'redo'} disabled={isRedoEnabled} onTapped={redo}/>
      </div>
      
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