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

  const togggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  // const homePage = HomePage;

  return (
    <Splitter>
      <SplitterSide
        side="left"
        isOpen={isMenuOpen}
        onClose={togggleMenuOpen}
        width={250}
        collapse='portrait'>
        <SideMenu/>
      </SplitterSide>
      <SplitterContent>
      <Navigator
        key='navi'
        initialRoute={{comp: HomePage, key: 'HomePage'}}
        renderPage={renderPage}/>
      </SplitterContent>
    </Splitter>
  )
}