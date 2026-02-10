import { createRef, ChangeEvent, useState, useRef, MouseEvent } from 'react';
import ons from 'onsenui'
import { Navigator, Page } from 'react-onsenui';
import EditPage from '../EditPage/EditPage';
import HowToPage from '../HowToPage/HowToPage';
import HelpPage from '../HelpPage/HelpPage';
import { WebtopoButton, DownloadButton, SaveButton, RotateButton, HelpButton, SelectImageButton, FreeTextDialog } from './Components'
import { MarkerPositionX, MarkerPositionY, StampTextSize, StampFreeTextSize } from './Constants';
import { getCurrentTimestamp, downloadURI, BlobToArrayBuffer, sleep } from '../../Functions'; 
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Group } from 'react-konva';
import { WallImage } from './WallImage';
import { NormalTarget } from './Targets/NormalTarget';
import { TextTarget } from './Targets/TextTarget';
import { RoundButton, CloseButton } from '../../Components';
import { IStampButton, IHoldStamp, ITextStamp, isIHoldStamp, isITextStamp } from '../../Types/StampType';
import { SizeProps } from '../../Types/SizeProps';
import { MAX_SIDE_LENGTH, HOLD_COLOR, SG_HOLD_COLOR } from '../../Constants';
import { postToWebtopo } from '../../Functions/postToWebtopo';

const PaintPage = ({route, navigator, mode, updateTopos}: 
  {route: any, navigator: Navigator, mode: string, updateTopos: () => void}) => {
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
    { key:1,  label: 'S・Gホールド',   holdColor: SG_HOLD_COLOR },
    { key:2,  label: 'ホールド',       holdColor: HOLD_COLOR },
    { key:3,  label: 'スタート',       contentText: 'S',        fontSize: StampTextSize, textColor: SG_HOLD_COLOR },
    { key:4,  label: 'ゴール',         contentText: 'G',        fontSize: StampTextSize, textColor: SG_HOLD_COLOR },
    { key:5,  label: 'スタート右',     contentText: 'S右',      fontSize: StampTextSize, textColor: SG_HOLD_COLOR },
    { key:6,  label: 'スタート左',     contentText: 'S左',      fontSize: StampTextSize, textColor: SG_HOLD_COLOR },
    { key:7,  label: 'フリーテキスト',  contentText: '',         fontSize: StampFreeTextSize, textColor: HOLD_COLOR }
  ];

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageSizeProps, setStageSizeProps] = useState<SizeProps>(sizeProps);
  const [imageSizeProps, setImageSizeProps] = useState<SizeProps>(sizeProps);
  const [stamps, setStamps] = useState<IStampButton[]>(initialButton.map(x => { return { ...x, isSelected: false } }));
  const [isFreeTextOpen, setIsFreeTextOpen] = useState<boolean>(false);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [imageWidth, setIMageWidth] = useState<number>(0);
  const [imageHeight, setIMageHeight] = useState<number>(0);
  const [howToVisibility, setHowToVisibility] = useState<boolean>(false);

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  const fileInputRef = createRef<HTMLInputElement>();

  const onSelectImageTapped = () => {
    fileInputRef.current?.click();
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files.item(0);

    if (file === null) return;

    const dataURL = URL.createObjectURL(file);
    const i = new window.Image();
    i.src = dataURL;
    setWallImage(i);
    setStamps((oldStamp) => {
      return oldStamp.map((x) => { return { ...x, isSelected: x.key === 1 }});
    });

    i.onload = (evt) => {
      setImageSizeProps((old) => {
        setIMageWidth(i.width);
        setIMageHeight(i.height);
        return { 
          ...old,
          centerX: window.innerWidth,
          centerY: window.innerHeight,
          width: i.width,
          height: i.height,
        }
      });
      if (localStorage.getItem('how_to_shown') !== 'true') {
        setHowToVisibility(true);
      }
    }
  }

  // 保存
  const onSaveTapped = async () => {
    if (!wallImage) {
      onSelectImageTapped();
      return;
    }
    // todo なぜawaitするとうまくリサイズされるのか
    await resizeStageToImageSize();
    // resizeStageToImageSize();

    stage.current.toCanvas().toBlob((data: any) => {
      if (!data) {
        alert('ページの表示に失敗しました。');
        return;
      }
  
      BlobToArrayBuffer(data, (res, e) => {
        navigator.pushPage({
          comp: EditPage,
          props: {
            key: 'EditPage',
            navigator: navigator,
            data: [res],
            updateTopos: updateTopos,
            onSaved: async () => {
              updateTopos();
              await navigator.popPage({animation: 'none'});
              await navigator.popPage({animation: 'none'});
            }
          }
        });
      },
      (res, e) => {
        
      });
    });

    resetStage();
  }

  // Webトポ連携
  const onWebtopoTapped = () => {
    if (!wallImage) {
      onSelectImageTapped();
      return;
    }
    ons.openActionSheet({
      cancelable: true,
      title: 'トポ画像をWebトポに連携しますか？',
      buttons: ['連携する', '縮小版を連携する', 'キャンセル'],
    }).then((idx: any) => {
      if (!stage || (idx !== 1 && idx !== 0)) return;
      const resize = idx === 1;
      resizeStageToImageSize();
      const fixPixelRatio = imageSizeProps.width > MAX_SIDE_LENGTH || imageSizeProps.height > MAX_SIDE_LENGTH;
      const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
      const uri = stage.current.toDataURL({pixelRatio: pixelRatio});
      postToWebtopo(uri, false);

      ons.notification.confirm({
        title: 'Webトポ連携',
        message: 'Webトポに画像を連携しました。\nWebトポで編集を続けてください。',
        buttonLabels: ['OK'],
      });
    });
  }

  // ダウンロード
  const onDownloadTapped = () => {
    if (!wallImage) {
      onSelectImageTapped();
      return;
    }
    ons.openActionSheet({
      cancelable: true,
      title: 'トポ画像をダウンロードしますか？',
      buttons: ['ダウンロード', '縮小版をダウンロード', 'キャンセル'],
    }).then((idx: any) => {
      if (!stage || (idx !== 1 && idx !== 0)) return;
      const resize = idx === 1;
      resizeStageToImageSize();
      const fixPixelRatio = imageSizeProps.width > MAX_SIDE_LENGTH || imageSizeProps.height > MAX_SIDE_LENGTH;
      const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
      const uri = stage.current.toDataURL({pixelRatio: pixelRatio});
      downloadURI(uri, getCurrentTimestamp() + '.png');
      resetStage();
    });
  }

  const onRotateTapped = () => {
    if (!wallImage) {
      onSelectImageTapped();
      return;
    }
    setIsRotated(old => {
      const newRotation = !isRotated;
      setImageSizeProps(old => {return {...old, width: newRotation ? imageHeight : imageWidth, height: newRotation ? imageWidth : imageHeight}});
      resizableImage.current.rotate();
      return newRotation;
    });
  }

  const onHelpTapped = () => {
    navigator.pushPage({
      comp: HelpPage,
      props: {
        key: 'HelpPage',
        navigator: navigator
      }
    });
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

  const onFreeTextOKTapped = (text: string) => {
    if (!text || text.length <= 0) {
      setIsFreeTextOpen(false);
      return;
    }
    setStamps(old => old.map((x, i) => {
      return isITextStamp(x) ? { ...x, contentText: x.label === 'フリーテキスト' ? text : x.contentText } : x;
    }));
    activateTarget({target: { innerText: 'フリーテキスト' }});
    setIsFreeTextOpen(false);
  }

  const activateFreeText = (e: MouseEvent<HTMLDivElement>) => {
    if (!wallImage) {
      onSelectImageTapped();
      return;
    }
    setIsFreeTextOpen(true);
  }

  const activateTarget = (e: any) => {
    if (!wallImage) {
      onSelectImageTapped();
      return;
    }
    const text = e.target.innerText;
    setStamps(old => old.map((x) => ({ ...x, isSelected : x.label === text })));
  }

  const holdTargetTapped = (evt: KonvaEventObject<Event>) => {
    const selected = stamps.find(x => x.isSelected);
    if (!isIHoldStamp(selected)) return;
    resizableImage.current.addCircle((selected as IHoldStamp).holdColor)
  }

  const textTargetTapped = (evt: KonvaEventObject<Event>) => {
    const selected = stamps.find(x => x.isSelected);
    if (!isITextStamp(selected)) return;
    const selectedText = selected as ITextStamp;
    resizableImage.current.addText(selectedText.contentText, selectedText.fontSize, selectedText.textColor);
  }

  const onCloseTapped = () => {
    if (wallImage) {
      ons.notification.confirm({
        title: 'トポ作成',
        message: '画面を閉じてもよろしいですか？\n現在編集中の内容は失われます。',
        buttonLabels: ons.platform.isIOS() ? ['いいえ', 'はい'] : ['はい', 'いいえ'],
        callback: (idx: any) => {
          const isYes = ons.platform.isIOS() ? idx === 1 : idx === 0;
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
      <div className={'page-content'}>
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
            />
          </Group>
          <NormalTarget
            key={'normalTarget'}
            x={MarkerPositionX - stageSizeProps.offsetX}
            y={MarkerPositionY - stageSizeProps.offsetY}
            isVisible={isIHoldStamp(stamps.find(x => x.isSelected))}
            onTapped={holdTargetTapped}
          />
          <TextTarget
            key={'textTarget'}
            x={MarkerPositionX - stageSizeProps.offsetX}
            y={MarkerPositionY - stageSizeProps.offsetY}
            character={(stamps.find(x => x.isSelected) as ITextStamp)?.contentText ?? ''}
            isVisible={isITextStamp(stamps.find(x => x.isSelected))}
            fontSize={(stamps.find(x => x.isSelected) as ITextStamp)?.fontSize ?? 0}
            onTapped={textTargetTapped}
          />
        </Layer>
      </Stage>
      <div className='horizontal-container'>
        {stamps.map(props => <RoundButton {...props} onTapped= {props.label === 'フリーテキスト' ? e => activateFreeText(e) : e => activateTarget(e)}/>)}
      </div>
      <SelectImageButton 
        isVisible={wallImage === null || wallImage === undefined} 
        onTapped={onSelectImageTapped}
      />
      <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
      { mode === 'webtopo' ? <WebtopoButton className={'webtopo-button'} onTapped={onWebtopoTapped}/> : <></> }   
      <DownloadButton className={'download-button'} onTapped={onDownloadTapped}/>
      <SaveButton className={'save-button'} onTapped={onSaveTapped}/>
      <RotateButton className={'rotate-button'} onTapped={onRotateTapped}/>
      <HelpButton className={'help-button'} onTapped={onHelpTapped}/>
      <input
        key={'file-uploader'}
        onChange={onChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type='file'
        accept='image/*'
      />
      </div>
      <FreeTextDialog 
        isOpen={isFreeTextOpen} 
        title={'フリーテキスト'} 
        msg={'画像に追加したい文言を入力してください。'} 
        maxLength={10}
        onOKTapped={onFreeTextOKTapped}/>
      {
        howToVisibility && <HowToPage/>
      }
    </Page>
  )
}

export default PaintPage;