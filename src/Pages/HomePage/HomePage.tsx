
import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
import { useLayoutEffect, useState } from 'react';
import { GRADES } from '../../Constants/Grades';
import { RectangleButtonProps } from '../../Components/RectangleButton';
import EditPage from '../EditPage/EditPage';
import { LoadingOverlay, RectangleButton, TopoCard } from '../../Components';

const HomePage = ({route, navigator, openMenu}: {route: any, navigator: Navigator, openMenu:() => void}) => {
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
  const [topoLimit, setTopoLimit] = useState<number>(5);
  const [searchText, setSearchText] = useState<string>('');
  const [topoDb, setTopoDb] = useState<TopoDB>(new TopoDB());
  const [searchGrades, setSearchGrades] 
    = useState<RectangleButtonProps[]>(
      GRADES
        .filter(x => x.id <= 10)
        .map(x => {return { key: x.id, label: x.name, isSelected: false, onTapped: onGradeClicked(x.id) };})
    );
  const [overlayVisibility, setOverlayVisibility] = useState<boolean>(true);

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
        updateTopos: updateTopos,
      }
    });
  }

  const updateTopos = () => {
    setOverlayVisibility(true);
    topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).toArray().then((topos) => {
      setTopos(topos);
      setOverlayVisibility(false);
    });
  }

  useLayoutEffect(updateTopos, [topoLimit]);

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

  const onDone = () =>{
    setTopoLimit(old => old + 5);
    updateTopos();
  }

  return (
    <Page
      key={'root'}
      onInfiniteScroll={onDone}>
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
              .map((x, i) => <TopoCard key={i} {...x} updateTopos={updateTopos} onEditTapped={openEditPage(x)}/>)
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