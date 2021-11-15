import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page, Splitter, SplitterContent, SplitterSide } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
import { useLayoutEffect, useState } from 'react';
import { TopoCard } from '../../Components/TopoCard';
import { GRADES } from '../../Constants/Grades';
import { RectangleButton, RectangleButtonProps } from '../../Components/RectangleButton';
import SideMenu from './SideMenu'

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const onGradeClicked = (id: number) => (e: React.MouseEvent<HTMLElement>) => {
    setSearchGrades(old => {
      const tapped = old.find(x => x.key === id);
      if (tapped === undefined) return old;
      tapped.isSelected = !tapped.isSelected;
      const newGrades = old.filter(x => x.key !== id);
      return [...newGrades, tapped].sort((a, b) => a.key > b.key ? 1 : -1);
    });
  }

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [topos, setTopos] = useState<ITopo[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchGrades, setSearchGrades] 
    = useState<RectangleButtonProps[]>(
      GRADES
        .filter(x => x.id <= 10)
        .map(x => {return { key: x.id, label: x.name, isSelected: false, onTapped: onGradeClicked(x.id) };})
    );

  const searchFunc = (x: ITopo) => 
    x.name.indexOf(searchText) > -1 
    && (searchGrades.filter(x => x.isSelected).length <= 0 || searchGrades.filter(x => x.isSelected).map(x => x.key).includes(x.grade));

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
    console.log(navigator);
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

  const togggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    // <Splitter>
    //   <SplitterSide
    //     side="left"
    //     isOpen={isMenuOpen}
    //     width={250}
    //     collapse='portrait'>
    //     <SideMenu/>
    //   </SplitterSide>
    //   <SplitterContent>
    //     <Page key={'root'}>
    //       <div className={'search-wrapper'}>
    //         <div className='search-container'>
    //           <div onClick={togggleMenuOpen}>
    //             <i className={'fas fa-bars'}/>
    //           </div>
    //           <input placeholder={'課題名で検索'} type='text' value={searchText} onChange={onSearchTextChange}/>
    //           <button className={searchText.length > 0 ? 'search-clear' : 'search-clear hidden'} onClick={onClrearClicked}>
    //             <i className={'far fa-times-circle'}/>
    //           </button>
    //         </div>
    //         <div className={'grade-container'}>
    //           {searchGrades.map((x, i) => <RectangleButton {...x}/>)}
    //         </div>
    //       </div>

    //       <div className={'topo-list'}>
    //         {
    //           topos.length <= 0 ? <p> トポが未作成です<br/>右下のボタンからトポを作成しましょう </p> :
    //           topos.filter(x => searchFunc(x)).length > 0 ?
    //           topos
    //             .filter(x => searchFunc(x))
    //             .sort((a, b) => a.createdAt > b.createdAt ? -1 : 1)
    //             .map((x, i) => <TopoCard key={i} {...x} updateTopos={updateTopos}/>)
    //           : <p> トポが見つかりませんでした </p>
    //         }
    //       </div>
    //       <button className={'edit-button'} onClick={openRightPaintPage}>
    //         <i className={'fas fa-pen'}/>
    //         トポ作成
    //       </button>
    //     </Page>
    //   </SplitterContent>
    // </Splitter>


    <Page key={'root'}>
      <div className={'search-wrapper'}>
        <div className='search-container'>
          <div>
            <i className={'fas fa-search'}/>
          </div>
          <input type='text' value={searchText} onChange={onSearchTextChange}/>
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