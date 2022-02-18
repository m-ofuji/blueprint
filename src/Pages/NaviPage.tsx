import { useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter, Page, List, ListItem } from 'react-onsenui';
import LicensePage from './LicensePage/LicensePage';

export const NaviPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [route, setRoute] = useState<any | undefined>();
  const [navigator, setNavigator] = useState<Navigator | undefined>();
  // const [openLicensePage, setOpenLicensePage] = useState<(() => void) | undefined>(undefined);

  const renderPage = (route: any, navigator: Navigator) => {
    console.log(route);
    setRoute(route);
    setNavigator(navigator);

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
    setIsMenuOpen(!isMenuOpen);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const onLicenseClicked = () => {
    if (isMenuOpen) {
      console.log('aaa');
      // openLicensePage();
      if (navigator != undefined && navigator.pages.length > 0) return;
      console.log('openLicensePage');
      navigator?.pushPage({
        comp: LicensePage,
        props: {
          key: 'LicensePage',
          route: route,
          navigator: navigator,
        }
      });
    }
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
      initialRoute={{comp: HomePage, key: 'HomePage'}}
      renderPage={renderPage}
      animation='lift'
    />
    </SplitterContent>
  </Splitter>
}