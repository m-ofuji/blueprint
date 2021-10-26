import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { TopoDb } from '../../DB/NavBar';
import { useState } from 'react';


const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const [blobUrl, updateBlobUrl] = useState<string[]>([]);

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
    .then((images) => {
      console.log(images);
      updateBlobUrl(old => { return [...old, ...images.map(x => window.URL.createObjectURL(x.data))]});
    });
  }

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
      <div className={'start-button-container'}>
        <h3>coming soon</h3>
        {/* <button onClick={getData}>データ取得</button>
        {blobUrl.map((x, i) => <img key={i} src={x} width={100}/>)} */}
      </div>

    </Page>
  )
}

export default HomePage;