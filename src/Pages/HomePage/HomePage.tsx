import ons from 'onsenui';
import PaintPage from '../PaintPage/PaintPage';
import { Navigator, Page } from 'react-onsenui';
import { ITopo, TopoDB } from '../../DB/TopoDB';
import { useLayoutEffect, useState } from 'react';
import { GRADES } from '../../Constants/Grades';
import { RectangleButtonProps } from '../../Components/RectangleButton';
import EditPage from '../EditPage/EditPage';
import { LoadingOverlay, RectangleButton, TopoCard } from '../../Components';
import { sleep } from '../../Functions';

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
    // alert('Topos');
    // alert(topoDb.Topos);
    // // alert(topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).count());
    // // alert(topoDb.Topos?.orderBy('id').reverse().limit(topoLimit));
    // topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).each(async topos => {
    //   alert('updateTopos');
    //   alert(topos);

    //   await sleep(100);

    //   setTopos(old => [...old, topos]);
    //   // setOverlayVisibility(false);
    // });

    // (async () => {
    //   alert('toCollection pk');
    //   // const keys = topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).keys();

    //   // const topos = topoDb.Topos?.toCollection().;

    //   const keys = await topoDb.Topos?.toCollection().primaryKeys();
    //   alert(keys);
    //   console.log(keys);
    //   keys?.forEach(async key => {
    //     const t = await topoDb.Topos?.where({id: key}).first();
    //     if (t) {
    //       setTopos(old => [...old, t]);
    //     }
    //   });
    //   setOverlayVisibility(false);
    //   // const keys = topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).keys();  
    // })();
    
    // topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).toArray(async topos => {
    //   alert('updateTopos');
    //   alert(topos);

    //   await sleep(100);

    //   setTopos(old => [...old, topos]);
    //   // setOverlayVisibility(false);
    // });
    // // setOverlayVisibility(false);
    // // alert('after ToposArray');

    // try {
    //   // alert('toporis');
      // topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).toArray().then((topos) => {
      //   setTopos(topos);
      //   setOverlayVisibility(false);
      // });

      topoDb.Topos?.orderBy('id').reverse().toArray().then((topos) => {
        setTopos(topos);
        setOverlayVisibility(false);
      });

      // alert('collection');
      // topoDb.Topos?.toCollection().primaryKeys();
      // alert('limit end');

      // topoDb.Topos?.orderBy('id').toArray().then((topos) => {
      //   setTopos(topos);
      //   setOverlayVisibility(false);
      // });
    // } catch(ex) {
    //   alert(ex);
    // }

    // (async () => {
    //   const topos = await topoDb.Topos?.orderBy('id').reverse().limit(topoLimit).toArray();
    //   setTopos(topos ?? []);
    //   setOverlayVisibility(false);
    // })();
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

  ons.ready(function() {
    ons.disableDeviceBackButtonHandler();
  });

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