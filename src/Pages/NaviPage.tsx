import { useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter } from 'react-onsenui';
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

  const togggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const renderP = ({mainRoute, mainNavigator}: {mainRoute: any, mainNavigator: Navigator}) => {
    const renderMenu = (route:any, navigator: Navigator) => {
      return (
        <route.comp 
          key={route.key} 
          // navigator={navigator}
          navigator={mainNavigator}
          mainNavigator={mainNavigator}
          {...route.props}
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
        onClose={togggleMenuOpen}
        width={250}
        collapse='portrait'>
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