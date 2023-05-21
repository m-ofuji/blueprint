import { useEffect, useRef, useState } from "react";
import ons from "onsenui"
import { Button } from "react-onsenui";
import { downloadCanvas, arrayBufferToUrl, drawTopoImageOnCanvas, urlToBlobImg } from "../Functions";
import { ITopo, TopoDB } from "../DB/TopoDB";
import { GRADES } from "../Constants/Grades";
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
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const downLoad = () => {
    ons.openActionSheet({
      cancelable: true,
      title: 'どの画像をダウンロードしますか？',
      buttons: ['元のサイズ', '元のサイズ（課題情報つき）', '縮小版', '縮小版（課題情報つき）', 'キャンセル'],
    }).then(async(idx: any) => {
      if (idx < 0) return;
      const resize = idx === 2 || idx === 3;
      const printInfo = idx === 1 || idx === 3;

      const drawnCanvas = await drawTopoImageOnCanvas(props, resize, printInfo);

      downloadCanvas(drawnCanvas, `${props.name}${resize ? '_min' : ''}${printInfo ? '_info' : ''}`);
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
    let update = true;

    if (isSelected) return;

    if (!update && isSelected) {
      setIsSelected(false);
    } else {
      return () => {update = false};
    }

    setTimeout(() => {
      if (update) {
        setIsSelected(true);
      }
    }, 500);

    return () => { update = false; };
  });

  const share = async () => {
    ons.openActionSheet({
      cancelable: true,
      title: 'どの画像を共有しますか？',
      buttons: ['元のサイズ', '元のサイズ（課題情報つき）', '縮小版',　'縮小版（課題情報つき）', 'キャンセル'],
    }).then(async(idx: any) => {
      if (idx < 0) return;
      const resize = idx === 2 || idx === 3;
      const printInfo = idx === 1 || idx === 3;

      const drawnCanvas = await drawTopoImageOnCanvas(props, resize, printInfo);

      const dataURL = drawnCanvas.toDataURL('image/png');
      const blob = urlToBlobImg(dataURL);

      if (blob === null) {
        alert('画像の共有に失敗しました');
        return;
      }
    
      const imageFile = new File([blob], 'image.png', { type: 'image/png' });

      const data: ShareData = {
        title: props.name,
        files: [imageFile]
      };

      navigator.share(data);

    });
  }

  return (
    <div className={'topo-card'}>
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