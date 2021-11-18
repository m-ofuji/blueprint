import { useRef } from "react";
import ons from "onsenui"
import { Button } from "react-onsenui";
import { downloadCanvas } from "../Functions/DownloadCanvas";
import { ITopo, TopoDB } from "../DB/TopoDB";
import { GRADES } from "../Constants/Grades";
import { MAX_SIDE_LENGTH } from "../Constants/MaxSideLength";

export interface TopoCardProps extends ITopo {
  updateTopos: () => void;
}

export const TopoCard = (props: TopoCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const downLoad = () => {
    if (!imageRef) return;
    ons.openActionSheet({
      cancelable: true,
      title: 'どの画像をダウンロードしますか？',
      buttons: ['元のサイズ', '元のサイズ（課題名・作成日・グレードあり）', '縮小版',　'縮小版（課題名・作成日・グレードあり）', 'キャンセル'],
    }).then((idx: any) => {
      if (idx < 0) return;
      if (!imageRef.current?.src) return;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const img = new Image();
      img.src = imageRef.current?.src;  // 画像のURLを指定
      img.onload = () => {

        const resize = idx === 2 || idx === 3;
        const printInfo = idx === 1 || idx === 3;  

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const fixPixelRatio = imgWidth > MAX_SIDE_LENGTH || imgHeight > MAX_SIDE_LENGTH;
        const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(imgWidth, imgHeight) : 1;

        const fontSize = 32;
        const padding = 8;

        const canvasWidth = imgWidth;
        const canvasHeight = printInfo ? imgHeight + (fontSize * 2) + (padding * 3) : imgHeight;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        if (printInfo) {
          // 背景色
          ctx.fillStyle = '#004898';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // トポ情報
          ctx.font = fontSize.toString() + 'px sans-serif';
          ctx.fillStyle = '#fafafa';
          ctx.textBaseline = 'top';
          ctx.textAlign = 'left';
          ctx.fillText(props.name, padding, imgHeight + padding);
          ctx.fillText(new Date(props.createdAt * 1000).toLocaleDateString(), padding, imgHeight + fontSize + (padding * 2));
          ctx.fillText(GRADES.find(x => x.id === props.grade)?.name ?? '', imgWidth - fontSize * 2, imgHeight + (fontSize / 2) + (padding * 2));
        }

        // 背景画像
        ctx.drawImage(img, 0, 0);

        downloadCanvas(canvas, resize ? props.name + '_min' : props.name, pixelRatio);
      };
    });
  }

  const deleteTopo = () => {
    ons.notification.confirm({
      title: 'トポ削除',
      message: '削除したトポは復元できません。\nトポを削除してよろしいですか。',
      buttonLabels: ons.platform.isIOSSafari() ? ['いいえ', 'はい'] : ['はい', 'いいえ'],
      callback: (idx: any) => {
        const isYes = ons.platform.isIOSSafari() ? idx === 1 : idx === 0;
        if (isYes && props.id !== undefined) {
          const db = new TopoDB();
          db.deleteTopo(props.id);
          props.updateTopos();
          ons.notification.toast('トポを削除しました。', {timeout: 2000});
        }
      }
    });
  }

  const openImage = () => {
    window.open(imageRef.current?.src);
  }

  return (
    <div className={'topo-card'}>
      <img ref={imageRef} alt={'画像の読み込みに失敗しました'} src={window.URL.createObjectURL(new Blob([props.data[0]], {type: 'image/png'}))} onClick={openImage}/>
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
        <Button modifier={'quiet'} className={'topo-card-action-button'} onClick={downLoad} >
          <i className={'fas fa-download fa-lg'}/>
        </Button>
      </div>
    </div>
  )
}