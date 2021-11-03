import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { ITopo, TopoDb } from '../../DB/NavBar';
import { useLayoutEffect, useState } from 'react';
import { TopoCard } from '../../Components/TopoCard';

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const [topos, setTopos] = useState<ITopo[]>([]);

  const openRightPaintPage = () => {
    handlePaintPage(false);
  }

  const openLeftyPaintPage = () => {
    handlePaintPage(true);
  }
  
  const handlePaintPage = (isLefty: boolean) => {
    navigator.pushPage({comp: PaintPage, props: {key: 'PaintPage', isLefty: isLefty, navigator: navigator}});
  }

  const getData = () => {
    const db = new TopoDb();
    db.TopoImages
    .toArray()
    .then((topos) => {
      setTopos(topos);
      // console.log(images);
      // updateBlobUrl(images.map(x => window.URL.createObjectURL(new Blob([x.data], {type: 'image/png'}))));
    });
  }

  useLayoutEffect(getData,[]);

  return (
    <Page key={'root'}>
      <div className={'section'}>
        <p className={'section-header'}>トポを作る</p>
        <div className={'start-button-container'}>
          <button className={'start-button'} onClick={openLeftyPaintPage}>左利き<br/>向け</button>
          <button className={'start-button'} onClick={openRightPaintPage}>右利き<br/>向け</button>
        </div>
      </div>
      
      <p className={'section-header'}>作成したトポ</p>
      <div>
        {topos.map((x, i) => <TopoCard key={i} {...x} />)}
      </div>
    </Page>
  )
}

export default HomePage;