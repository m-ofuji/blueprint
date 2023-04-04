import { useRef, useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter, Page, List, ListItem } from 'react-onsenui';
import LicensePage from './LicensePage/LicensePage';
import { TopoDB } from '../DB/TopoDB';
import { downloadBlob, loadLoalFile } from '../Functions';
import JSZip from 'jszip'

export const NaviPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigator = useRef<Navigator>(null);
  const initialRoute = {comp: HomePage, key: 'HomePage'};

  const renderPage = (route: any, navigator: Navigator) => {
    return (
      <route.comp 
        key={route.key} 
        navigator={navigator}
        openMenu={openMenu}
        {...route.props}
      />
    );
  }

  const toggleMenuOpen = () => {
    setIsMenuOpen(false);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const onLicenseClicked = () => {
    if (!isMenuOpen) return;
    setIsMenuOpen(false);
    navigator?.current?.pushPage({
        comp: LicensePage,
        props: {
          key: 'LicensePage',
          route: initialRoute,
          navigator: navigator.current,
        }
      }
    );
  }

  const exportTopo = async () => {
    const db = new TopoDB();
    const topos = (await db.Topos.toArray());
    
    const zip = new JSZip();

    const jsonTopos = topos.map(x => { 
      const fileName = `topo_${x.id}.png`;
      zip.file(fileName, x.data[0]);
      return {
        id: x.id,
        name: x.name,
        setter: x.setter,
        grade: x.grade,
        createdAt: x.createdAt,
        file_name: `topo_${x.id}.png`
      }
    });
    const blob = new Blob([JSON.stringify(jsonTopos)], {type: 'application/json'});

    zip.file('topos.json', blob);

    topos.forEach(x => {
      zip.file(`topo_${x.id}.png`, )
    });

    const zipBlob = await zip.generateAsync({type:'blob'});
    downloadBlob(zipBlob, 'topos.zip');
  }

  const importTopo = async () => {
    loadLoalFile(files => {
      JSZip.loadAsync(files[0]).then(x => {
        x.forEach((path, zip) => console.log(path, zip));
      });
    });
  }

  return <Splitter>
    <SplitterSide
      side="left"
      isOpen={isMenuOpen}
      onClose={toggleMenuOpen}
      width={250}
      collapse='portrait'>
      <Page>
        <List>
          <ListItem 
            key={1}
            className={'menu-item'}
            tappable
            onClick={onLicenseClicked}
            modifier='longdivider'>
              <i className={'fas fa-award'}/> ライセンス情報
          </ListItem>
          <ListItem 
            key={2}
            className={'menu-item'}
            tappable
            onClick={exportTopo}
            modifier='longdivider'>
              <i className={'fas fa-database'}/> 一括ダウンロード
          </ListItem>
          <ListItem 
            key={3}
            className={'menu-item'}
            tappable
            onClick={importTopo}
            modifier='longdivider'>
              <i className={'fas fa-file-import'}/> インポート
          </ListItem>
          <ListItem 
            key={4}
            className={'menu-item'}
            tappable
            modifier='longdivider'>
              バージョン:1.0.0
          </ListItem>
        </List>
      </Page>
    </SplitterSide>
    <SplitterContent>
    <Navigator
      key='navi'
      ref={navigator}
      initialRoute={initialRoute}
      renderPage={renderPage}
      animation='lift'
    />
    </SplitterContent>
  </Splitter>
}