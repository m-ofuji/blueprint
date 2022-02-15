import { useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter, Page, List, ListItem } from 'react-onsenui';
// import LicensePage from './LicensePage/EditPage';

export const NaviPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // const [openLicensePage, setOpenLicensePage] = useState<(() => void) | undefined>(undefined);

  const renderPage = (route: any, navigator: Navigator) => {
    // setOpenLicensePage(
    //   () => {
    //     // console.log(navigator.pages.length);
    //     // if (navigator.pages.length > 0) return;
    //     // console.log('openLicensePage');
    //     // navigator.pushPage({
    //     //   comp: LicensePage,
    //     //   props: {
    //     //     key: 'LicensePage',
    //     //     route: route,
    //     //     navigator: navigator,
    //     //   }
    //     // });
    //   }
    // );

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
    // if (isMenuOpen && openLicensePage) {
    //   openLicensePage();
    // }
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
      animation='lift'/>
    </SplitterContent>
  </Splitter>
}