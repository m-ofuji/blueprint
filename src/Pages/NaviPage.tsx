import { useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter, Page } from 'react-onsenui';
import SideMenu from './HomePage/SideMenu';

export const NaviPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const renderPage = (route:any, navigator: Navigator) => {
    return (
      <route.comp 
        key={route.key} 
        navigator={navigator}
        openMenu={openMenu}
        {...route.props}
      />
    );
  }

  // const renderMenu = (route:any, navigator: Navigator) => {
  //   return (
  //     <route.comp 
  //       key={route.key} 
  //       navigator={navigator}
  //       {...route.props}
  //     />
  //   );
  // }

  const toggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const renderP = (mainRoute:any, mainNavigator: Navigator) => {
  // const renderP = ({mainRoute, mainNavigator}: {mainRoute: any, mainNavigator: Navigator}) => {
    const renderMenu = (route:any, navigator: Navigator) => {
      return (
        <mainRoute.comp 
          key={mainRoute.key} 
          // navigator={navigator}
          navigator={mainNavigator}
          {...mainRoute.props}
          // {...route.props, mainRoute, mainNavigator}
        />
      );
    }

    // const renderPage = (route:any, navigator: Navigator) => {
    //   return (
    //     <route.comp 
    //       key={route.key} 
    //       navigator={navigator}
    //       openMenu={openMenu}
    //       {...route.props}
    //     />
    //   );
    // }

    return <Splitter>
      <SplitterSide
        side="left"
        isOpen={isMenuOpen}
        onClose={toggleMenuOpen}
        width={250}
        collapse='portrait'>
        {/* <SideMenu
          route={mainRoute}
          navigator={mainNavigator}>
        </SideMenu> */}
        <Navigator
          key='navi'
          initialRoute={{comp: SideMenu, key: 'SideMenu'}}
          renderPage={renderMenu}
          animation='lift'>
        </Navigator>
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