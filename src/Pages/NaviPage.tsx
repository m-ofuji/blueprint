import { useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter, Page } from 'react-onsenui';
import SideMenu from './HomePage/SideMenu';
import HelpPage from './HelpPage/HelpPage';

export const NaviPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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
    setIsMenuOpen(!isMenuOpen);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const renderP = (mainRoute:any, mainNavigator: Navigator) => {
    const openHelpPage = () => {
      // console.log('help open');
      // setIsMenuOpen(false);
      mainNavigator.pushPage({
        comp: HelpPage,
        props: {
          key: 'HelpPage',
          navigator: navigator
        }
      });
    }

    const renderMenu = (route:any, navigator: Navigator) => {
      return (
        <route.comp 
          key={route.key} 
          navigator={navigator}
          {...route.props}
          // {...route.props, mainRoute, mainNavigator}
        />
      );
    }

    return <Splitter>
      <SplitterSide
        side="left"
        isOpen={isMenuOpen}
        onClose={toggleMenuOpen}
        width={250}
        collapse='portrait'>
        <SideMenu
          route={mainRoute}
          navigator={mainNavigator}
          openHelpPage={openHelpPage}>
        </SideMenu>
        {/* <Navigator
          key='navi'
          initialRoute={{comp: SideMenu, key: 'SideMenu'}}
          renderPage={renderMenu}
          animation='lift'>
        </Navigator> */}
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

  return (
    <Navigator
      key='navi2'
      initialRoute={{comp: SideMenu, key: 'SideMenu'}}
      renderPage={renderP}
      animation='lift'>
    </Navigator>
  )
}