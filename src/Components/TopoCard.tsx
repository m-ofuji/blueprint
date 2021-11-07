import { useRef } from "react";
import ons from "onsenui"
import { Button } from "react-onsenui";
import { downloadURI } from "../Common/Functions/DownloadUri";
import { getCurrentTimestamp } from "../Common/Functions/CurrentTimestamp";
import { ITopo, TopoDB } from "../DB/TopoDB";

export interface TopoCardProps extends ITopo {
  updateTopos: () => void;
}

export const TopoCard = (props: TopoCardProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const downLoad = () => {
    if (!imageRef) return;
    const uri = window.URL.createObjectURL(new Blob([props.data], {type: 'image/png'}));
    downloadURI(uri, getCurrentTimestamp() + '.png');
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
      <img ref={imageRef} src={window.URL.createObjectURL(new Blob([props.data], {type: 'image/png'}))} onClick={openImage}/>
      <div className={'topo-card-data'}>
        <div className={'topo-card-title'}>{props.name}</div>
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