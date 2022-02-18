import { useRef, useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter, Page, List, ListItem } from 'react-onsenui';
import LicensePage from './LicensePage/LicensePage';

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