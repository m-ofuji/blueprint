import { useEffect, useRef, useState } from "react";
import ons from "onsenui"
import { Button } from "react-onsenui";
import { downloadCanvas, resizeCanvas, urlToFile, arrayBufferToUrl } from "../Functions";
import { ITopo, TopoDB } from "../DB/TopoDB";
import { GRADES } from "../Constants/Grades";
import { MAX_SIDE_LENGTH } from "../Constants/MaxSideLength";
import { MAIN_COLOR } from "../Constants/Colors";
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface TopoCardProps extends ITopo {
  db: TopoDB | undefined
  updateTopos: () => void,
  onEditTapped?: () => void;
}

interface ShareData {
  files?: File[];
  text?: string;
  title?: string;
  url?: string;
}

export const TopoCard = (props: TopoCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isTouchEnd, setIsTouchEnd] = useState<boolean>(true);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const downLoad = () => {
    if (!imageRef) return;
    ons.openActionSheet({
      cancelable: true,
      title: 'どの画像をダウンロードしますか？',
      buttons: ['元のサイズ', '元のサイズ（課題情報つき）', '縮小版',　'縮小版（課題情報つき）', 'キャンセル'],
    }).then((idx: any) => {
      if (idx < 0) return;
      if (!imageRef.current?.src) return;
      const canvas = document.createElement('canvas');

      const img = new Image();
      img.src = imageRef.current?.src;  // 画像のURLを指定
      img.onload = () => {

        const resize = idx === 2 || idx === 3;
        const printInfo = idx === 1 || idx === 3;  

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const fixPixelRatio = imgWidth > MAX_SIDE_LENGTH || imgHeight > MAX_SIDE_LENGTH;
        const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(imgWidth, imgHeight) : 1;

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        // トポ画像描画
        ctx.drawImage(img, 0, 0);

        const resizedCanvas = resizeCanvas(canvas, pixelRatio);

        const minSuf = resize ? '_min' : '';
        const infoSuf = printInfo ? '_info' : '';

        if (!printInfo) {
          downloadCanvas(resizedCanvas, props.name + minSuf + infoSuf, 1);
        } else {
          const infoCanvas = document.createElement('canvas');

          const fontSize = resizedCanvas.height * 0.05;
          const padding = fontSize / 4;

          const infoWidth = resizedCanvas.width;
          const infoHeight = resizedCanvas.height + (fontSize * 2) + (padding * 3);

          infoCanvas.width = infoWidth;
          infoCanvas.height = infoHeight;

          const infoCtx = infoCanvas.getContext('2d');
          if (!infoCtx) return;

          // 背景色設定
          infoCtx.fillStyle = MAIN_COLOR;
          infoCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);

          // トポ情報描画
          infoCtx.font = fontSize.toString() + 'px sans-serif';
          infoCtx.fillStyle = '#fafafa';
          infoCtx.textBaseline = 'top';
          infoCtx.textAlign = 'left';
          const resizedHeigt = resizedCanvas.height;
          infoCtx.fillText(props.name, padding, resizedHeigt + padding);
          infoCtx.fillText(new Date(props.createdAt * 1000).toLocaleDateString(), padding, resizedHeigt + fontSize + (padding * 2));
          infoCtx.fillText(GRADES.find(x => x.id === props.grade)?.name ?? '', infoWidth - fontSize * 2 - padding, resizedHeigt + (fontSize / 2) + (padding * 2));

          // トポ画像コピー
          const copied = resizedCanvas.getContext('2d')?.getImageData(0, 0, resizedCanvas.width, resizedCanvas.height);
          if (!copied) return;
          infoCtx.putImageData(copied, 0, 0);

          downloadCanvas(infoCanvas, props.name + minSuf + infoSuf, 1);
        }
      };
    });
  }

  const deleteTopo = () => {
    ons.notification.confirm({
      title: 'トポ削除',
      message: '削除したトポは復元できません。\nトポを削除してよろしいですか。',
      buttonLabels: ons.platform.isIOS() ? ['いいえ', 'はい'] : ['はい', 'いいえ'],
      callback: async (idx: any) => {
        const isYes = ons.platform.isIOS() ? idx === 1 : idx === 0;
        if (isYes && props.id !== undefined) {
          // const db = new TopoDB();
          console.log(props.db);
          await props.db?.deleteTopo(props.id);
          props.updateTopos();
          ons.notification.toast('トポを削除しました。', {timeout: 2000});
        }
      }
    });
  }

  const openImage = () => {
    window.open(imageRef.current?.src);
  }

  useEffect(() => {
    // console.log('effect');
    let update = true;

    if (isSelected && !isTouchEnd) return;

    if (!update && isSelected && isTouchEnd) {
      setIsSelected(false);
      // return () => {update = false};
      // setTimeout(() => {
      //   // if (update) {
      //     console.log('aaa');
      //     setIsSelected(false);
      //   // }
      // }, 1);
    } else {
      return () => {update = false};
    }

    setTimeout(() => {
      // console.log('effect: 500ms', isTouchEnd);
      // console.log(update);
      if (!isTouchEnd && update) {
        setIsSelected(true);
      }
    }, 500);

    return () => { update = false; };
  }, [isTouchEnd]);

  const onTouchStart = async () => {
    // console.log('start');

    // if (isSelected) {
    //   setIsSelected(false);
    // }

    setIsTouchEnd(false);
    // if (isSelected) {
    //   setIsSelected(false);
    // }
  }

  const onTouchEnd = async () => {
    // console.log('end');
    setIsTouchEnd(true);
  }

  const share = async () => {
    const picture = await urlToFile(arrayBufferToUrl(props.data[0]), props.name);

    const data: ShareData = {
      title: props.name,
      files: [picture]
    };

    await window.navigator.share(data).catch(error => console.log(error));
  }

  return (
    <div className={'topo-card'}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* {
        props.data.map(x => {
          <img ref={imageRef} src={arrayBufferToUrl(x)} alt={'画像の読み込みに失敗しました'} onClick={openImage}/>
        })
      } */}
      <div className={'topo-card-image-box'}>
        <img ref={imageRef} src={arrayBufferToUrl(props.data[0])} alt={props.name} onClick={openImage}/>
        { isSelected ? <i className={'fas fa-check-circle fa-2x'}/> : '' }
      </div>
      <div className={'topo-card-data'}>
        <div className={'topo-card-title-container'}>
          <div className={'topo-card-title'}>{props.name}</div>
          <div className={`topo-card-grade grade${GRADES.find(x => x.id === props.grade)?.id}`}>{GRADES.find(x => x.id === props.grade)?.name}</div>
        </div>
        <div>{new Date(props.createdAt * 1000).toLocaleDateString()}</div>
      </div>
      <div className={'topo-card-divider'}/>
      <div className={'topo-card-action'}>
        <Button modifier={'quiet'} className={'topo-card-action-button'} onClick={deleteTopo} >
          <i className={'fas fa-trash-alt fa-lg'}/>
        </Button>
        <Button modifier={'quiet'} className={'topo-card-action-button'} onClick={share} >
          <FontAwesomeIcon className={'fa-lg'} icon={faShareNodes}/>
        </Button>
        <Button modifier={'quiet'} className={'topo-card-action-button'} onClick={downLoad} >
          <i className={'fas fa-download fa-lg'}/>
        </Button>
        <Button modifier={'quiet'} className={'topo-card-action-button'} onClick={props.onEditTapped} >
          <i className={'fas fa-edit fa-lg'}/>
        </Button>
      </div>
    </div>
  )
}