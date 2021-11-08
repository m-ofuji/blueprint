import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page, Button, Modal } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
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
    navigator.pushPage({
      comp: PaintPage,
      props: {
        key: 'PaintPage',
        isLefty: isLefty,
        navigator: navigator,
        updateTopos: updateTopos
      }
    });
  }

  const updateTopos = () => {
    const db = new TopoDB();
    db.TopoImages
    .toArray()
    .then((topos) => {
      setTopos(topos);
    });
  }

  useLayoutEffect(updateTopos,[]);

  return (
    <Page key={'root'}>
      <div className="search-container">
        <input type="text"　/>
        <button>
          <i className={'fas fa-search'}/>
        </button>
      </div>

      <div className={'topo-list'}>
        {topos.length > 0 ? 
          topos
            .sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
            .map((x, i) => <TopoCard key={i} {...x} updateTopos={updateTopos}/>)
          : <p> トポが作成されていません。 </p>
        }
      </div>
      <button className={'edit-button'} onClick={openRightPaintPage}>
        <i className={'fas fa-pen'}/>
        トポ作成
      </button>
    </Page>
  )
}

export default HomePage;