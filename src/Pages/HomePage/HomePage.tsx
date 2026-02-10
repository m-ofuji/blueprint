import ons from 'onsenui';
import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
import { useLayoutEffect, useState, useRef, useCallback } from 'react';
import { GRADES } from '../../Constants/Grades';
import { RectangleButtonProps } from '../../Components/RectangleButton';
import EditPage from '../EditPage/EditPage';
import { LoadingOverlay, RectangleButton, TopoCard } from '../../Components';
import { useLocation } from "react-router-dom";

const HomePage = ({route, navigator, openMenu}: {route: any, navigator: Navigator, openMenu:() => void}) => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const mode = query.get('mode');

  const onGradeClicked = (id: number) => (e: React.MouseEvent<HTMLElement>) => {
    setSearchGrades(old => {
      const tapped = old.find(x => x.key === id);
      if (tapped === undefined) return old;
      tapped.isSelected = !tapped.isSelected;
      const newGrades = old.filter(x => x.key !== id);
      return [...newGrades, tapped].sort((a, b) => a.key > b.key ? 1 : -1);
    });
  }

  const [topos, setTopos] = useState<ITopo[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchGrades, setSearchGrades] 
    = useState<RectangleButtonProps[]>(
      GRADES
        .filter(x => x.id <= 10)
        .map(x => {return { key: x.id, label: x.name, isSelected: false, onTapped: onGradeClicked(x.id) };})
    );
  const [overlayVisibility, setOverlayVisibility] = useState<boolean>(true);

  const topoDb = useRef<TopoDB>(new TopoDB);
  const topoLimit = useRef<number>(5);

  const searchFunc = (x: ITopo) => 
    x.name.indexOf(searchText) > -1 
    && (searchGrades.filter(x => x.isSelected).length <= 0 || searchGrades.filter(x => x.isSelected).map(x => x.key).includes(x.grade));

  const handlePaintPage = () => {
    navigator.pushPage({
      comp: PaintPage,
      props: {
        key: 'PaintPage',
        isLefty: false,
        navigator: navigator,
        mode: mode,
        updateTopos: updateTopos,
      }
    });
  }

  const updateTopos = useCallback(() => {
    topoDb.current?.Topos.orderBy('id').limit(topoLimit.current).reverse().toArray().then((topos) => {
      setTopos(topos);
      setOverlayVisibility(false);
    });
  }, [topoDb.current, topoLimit.current])

  useLayoutEffect(updateTopos, [topoLimit, topoDb.current]);

  const onSearchTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }

  const onClrearClicked = (e: React.MouseEvent<HTMLElement>) => {
    setSearchText('');
  }

  const openEditPage = (topo: ITopo) => () => {
    navigator.pushPage({
      comp: EditPage,
      props: {
        key: 'EditPage',
        navigator: navigator,
        ...topo,
        onSaved: async () => {
          updateTopos();
          await navigator.popPage({animation: 'none'});
        }
      }
    });
  }

  const onScrollDone = async (done: () => void) =>{
    if(!overlayVisibility ) {
      const topoCount = (await topoDb.current?.Topos.count()) ?? 0;
      if (topoCount > topoLimit.current) {
        topoLimit.current = Math.min(topoLimit.current + 5, topoCount);
        updateTopos();
      }
    }
    done();
  }

  ons.ready(function() {
    ons.disableDeviceBackButtonHandler();
  });

  return (
    <Page
      key={'root'}
      onInfiniteScroll={onScrollDone}>
      <div className={'page-content'}>
        <div className={'search-wrapper'}>
          <div className='search-container'>
            <div onClick={openMenu}>
              <i className={'fas fa-bars'}/>
            </div>
            <input placeholder={'課題名で検索'} type='text' value={searchText} onChange={onSearchTextChange}/>
            <button className={searchText.length > 0 ? 'search-clear' : 'search-clear hidden'} onClick={onClrearClicked}>
              <i className={'far fa-times-circle'}/>
            </button>
          </div>
          <div className={'grade-container'}>
            {searchGrades.map((x, i) => <RectangleButton {...x}/>)}
          </div>
        </div>

        <div className={'topo-list'}>
          {
            topos.length <= 0 ? <p> トポが未作成です<br/>右下のボタンからトポを作成しましょう </p> :
            topos.filter(x => searchFunc(x)).length > 0 ?
            topos
              .filter(x => searchFunc(x))
              .sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
              .map((x, i) => <TopoCard 
                key={i} {...x} 
                db={topoDb.current} 
                mode={mode}
                updateTopos={updateTopos} 
                onEditTapped={openEditPage(x)}/>)
            : <p> トポが見つかりませんでした </p>
          }
        </div>
        <LoadingOverlay isVisible={overlayVisibility}/>
        <button className={'edit-button'} onClick={handlePaintPage}>
          <i className={'fas fa-pen'}/>
          トポ作成
        </button>
      </div>
    </Page>
  )
}

export default HomePage;