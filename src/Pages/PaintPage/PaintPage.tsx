import ons from 'onsenui'
import EditPage from '../EditPage/EditPage';
import { Navigator } from 'react-onsenui';
import { createRef, ChangeEvent, useState, useRef, useLayoutEffect} from 'react';
import { Page } from 'react-onsenui';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Group } from 'react-konva';
import { WallImage } from './WallImage';
import { NormalTarget } from './Targets/NormalTarget';
import { TextTarget } from './Targets/TextTarget';
import { RoundButton } from '../../Components/RoundButton';
import { DownloadButton } from './Components/DownloadButton';
import { SaveButton } from './Components/SaveButton';
import { CloseButton } from '../../Components/CloseButton';
import { MarkerPositionX, MarkerPositionY } from './Constants';
import { getCurrentTimestamp } from '../../Functions/CurrentTimestamp'; 
import { downloadURI } from '../../Functions/DownloadUri';
import { IStampButton, IHoldStamp, ITextStamp, isIHoldStamp, isITextStamp } from '../../Types/StampType';
import { SizeProps } from '../../Types/SizeProps';
import { MAX_SIDE_LENGTH } from '../../Constants/MaxSideLength';
import { BlobToArrayBuffer } from '../../Functions/BlobToArrayBuffer';
import { HOLD_COLOR, SG_HOLD_COLOR } from '../../Constants/Colors';

const PaintPage = ({route, navigator, updateTopos}: 
  {route: any, navigator: Navigator, updateTopos: () => void}) => {
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

  // history イベントの監視
  window.addEventListener('popstate', function (e) {
    // if (isHistoryPush) {
      alert('navipage ブラウザでの戻るボタンは禁止されております。');
      window.history.pushState(null, '');
    // }
  }, false);

  // ons.ready(() => {
  //   ons.disableDeviceBackButtonHandler();
  //   document.addEventListener("backbutton", function(){
  //     console.log('back button');
  //   }, false);
  // });

  // ons.enableDeviceBackButtonHandler();
  // console.log('set back button paintpage');
  // ons.setDefaultDeviceBackButtonListener(() => {
  //   console.log('back button pressed');
  //   if (navigator.pages.length > 0) {
  //     navigator.popPage();
  //   }
  // });

  const initialButton = [
    { key:1,  label: 'S・Gホールド',   isSelected: true,  onTapped: () => activateTarget(0), holdColor: SG_HOLD_COLOR },
    { key:2,  label: 'ホールド',       isSelected: false, onTapped: () => activateTarget(1), holdColor: HOLD_COLOR },
    { key:3,  label: 'スタート',       isSelected: false, onTapped: () => activateTarget(2), contentText: 'S', textColor: SG_HOLD_COLOR },
    { key:4,  label: 'ゴール',         isSelected: false, onTapped: () => activateTarget(3), contentText: 'G', textColor: SG_HOLD_COLOR },
    { key:5,  label: 'スタート右',     isSelected: false, onTapped: () => activateTarget(4), contentText: 'S右', textColor: SG_HOLD_COLOR },
    { key:6,  label: 'スタート左',     isSelected: false, onTapped: () => activateTarget(5), contentText: 'S左', textColor: SG_HOLD_COLOR },
    { key:7,  label: 'カンテ',         isSelected: false, onTapped: () => activateTarget(6), contentText: 'カンテ', textColor: SG_HOLD_COLOR },
    { key:8,  label: 'ハリボテ',       isSelected: false, onTapped: () => activateTarget(7), contentText: 'ボテあり', textColor: SG_HOLD_COLOR },
    { key:9,  label: '足自由',　       isSelected: false, onTapped: () => activateTarget(8), contentText: '足自由', textColor: SG_HOLD_COLOR },
    { key:10, label: 'フリーテキスト', isSelected: false, onTapped: () => activateFreeText(9), contentText: '', textColor: SG_HOLD_COLOR }
  ];

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageSizeProps, setStageSizeProps] = useState<SizeProps>(sizeProps);
  const [imageSizeProps, setImageSizeProps] = useState<SizeProps>(sizeProps);
  const [stamps, setStamps] = useState<IStampButton[]>(initialButton);
  const [initial, setInitial] = useState<string>('msg');
  const [freeText, setFreeText] = useState<string>('');

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  const fileInputRef = createRef<HTMLInputElement>();

  useLayoutEffect(() => { 
    if (wallImage) return;

    if (ons.platform.isIOS() && fileInputRef.current) {
      fileInputRef.current.click();
      return;
    }

    if (initial === 'open' && fileInputRef.current) {
      fileInputRef.current.click();
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
        } 
      });
    }
  }

  // 保存
  const onSaveTapped = async () => {
    // todo なぜawaitするとうまくリサイズされるのか
    await resizeStageToImageSize();

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

  // ダウンロード
  const onDownloadTapped = () => {
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

  const activateFreeText = (index: number) => {
    ons.notification.prompt({
      title: 'フリーテキスト',
      message: '画像に追加したい文言を入力してください。',
      buttonLabels: ['OK'],
      callback: (txt: string) => {
        if (!txt) return;

        setStamps(old => old.map((x, i) => {
          return isITextStamp(x) ? { ...x, contentText: x.label === 'フリーテキスト' ? txt : x.contentText } : x;
        }));
        activateTarget(index);
      }
      // callback: (txt: string) => {
      //   setStamps(old => old.map((x, i) => {
      //     console.log(freeText);
      //     return isITextStamp(x) ? { ...x, contentText: x.label === 'フリーテキスト' ? txt : x.contentText } : x;
      //   }));
      //   activateTarget(index);
      // }
    });
  }

  const activateTarget = (index: number) => {
    setStamps(old => old.map((x,i) => {return { ...x, isSelected : i === index }}));
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
    resizableImage.current.addText(selectedText.contentText, selectedText.textColor);
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
            onTapped={textTargetTapped}
          />
        </Layer>
      </Stage>
      <div className={'horizontal-container'}>
        {stamps.map((props, i) => <RoundButton {...props}/>)}
      </div>
      <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
      <DownloadButton className={'download-button'} onTapped={onDownloadTapped}/>
      <SaveButton className={'save-button'} onTapped={onSaveTapped}/>
      <input
        key={'file-uploader'}
        onChange={onChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type='file'
        accept='image/*'
      />
      </div>
    </Page>
  )
}

export default PaintPage;