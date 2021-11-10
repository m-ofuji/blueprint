import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
import { useLayoutEffect, useState } from 'react';
import { TopoCard } from '../../Components/TopoCard';

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const [topos, setTopos] = useState<ITopo[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const searchFunc = (x:ITopo) => x.name.indexOf(searchText) > -1;

  const openRightPaintPage = () => {
    handlePaintPage(false);
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
    db.TopoImages.toArray().then((topos) => { setTopos(topos); });
  }

  useLayoutEffect(updateTopos,[]);

  const onSearchTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }

  const onClrearClicked = (e: React.MouseEvent<HTMLElement>) => {
    setSearchText('');
  }

  return (
    <Page key={'root'}>
      <div className='search-container'>
        <div>
          <i className={'fas fa-search'}/>
        </div>
        <input type='text' value={searchText} onChange={onSearchTextChange}/>
        <button className={searchText.length > 0 ? 'search-clear' : 'search-clear hidden'} onClick={onClrearClicked}>
          <i className={'far fa-times-circle'}/>
        </button>
      </div>

      <div className={'topo-list'}>
        {
          topos.filter(x => searchFunc(x)).length > 0 ?
          topos
            .filter(x => searchFunc(x))
            .sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
            .map((x, i) => <TopoCard key={i} {...x} updateTopos={updateTopos}/>)
          : <p> トポが見つかりませんでした </p>
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