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
      title: 'トポ画像をダウンロードしますか？',
      buttons: ['ダウンロード', '縮小版をダウンロード', 'キャンセル'],
    }).then((idx: any) => {
      if (!imageRef.current?.src || idx !== 1 && idx !== 0) return;
      const resize = idx === 1;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      
      const img = new Image();
      img.src = imageRef.current?.src;  // 画像のURLを指定
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const fixPixelRatio = width > MAX_SIDE_LENGTH || height > MAX_SIDE_LENGTH;
        const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(width, height) : 1;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
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
      <img ref={imageRef} src={window.URL.createObjectURL(new Blob([props.data[0]], {type: 'image/png'}))} onClick={openImage}/>
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