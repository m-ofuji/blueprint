import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
import { useLayoutEffect, useState } from 'react';
import { TopoCard } from '../../Components/TopoCard';
import { GRADES } from '../../Constants/Grades';
import { RectangleButton, RectangleButtonProps } from '../../Components/RectangleButton';

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const [topos, setTopos] = useState<ITopo[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchGrades, setSearchGrades] = useState<number[]>([]);

  const searchFunc = (x:ITopo) => 
    x.name.indexOf(searchText) > -1 && (searchGrades.length <= 0 || searchGrades.includes(x.grade));

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

  const onGradeClicked = (id: number) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      
    };
  }

  return (
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
          {GRADES.map((x, i) => <RectangleButton key={x.id} label={x.name} isSelected={false} onTapped={onGradeClicked(x.id)}/>)}
        </div>
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