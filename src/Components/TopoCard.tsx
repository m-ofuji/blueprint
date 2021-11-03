import { ITopo } from "../DB/NavBar"

export const TopoCard = (props: ITopo) => {
  return (
    <div className={'topo-card'}>
      <img src={window.URL.createObjectURL(new Blob([props.data], {type: 'image/png'}))}/>
      <div className={'topo-card-data'}>
        <div className={'topo-card-title'}>{props.name}</div>
        <div>{new Date(props.createdAt * 1000).toLocaleDateString()}</div>
      </div>
      <div className={'topo-card-divider'}/>
      <div className={'topo-card-data'}>
        <div>ダウンロード</div>
      </div>
    </div>
  )
}