import { useState } from 'react';
import HomePage from './HomePage/HomePage';
import { Navigator, SplitterContent, SplitterSide, Splitter } from 'react-onsenui';
import SideMenu from './HomePage/SideMenu';
import ons from 'onsenui';

export const NaviPage = () => {
  // document. = function() { return false; }

  // window.addEventListener('popstate', e => {
  //   alert('ブラウザバックを検知しました。');
  //   e.preventDefault();
  // });

  // ons.ready(() => {
  //   ons.disableDeviceBackButtonHandler();
  //   document.addEventListener("backbutton", function(){
  //     console.log('back button');
  //   }, false);
  // });

  // history イベントの監視
  window.addEventListener('popstate', function (e) {
    // if (isHistoryPush) {
      alert('navipage ブラウザでの戻るボタンは禁止されております。');
      window.history.pushState(null, '');
    // }
  }, false);

  // window.onhashchange = e => {
  //   //blah blah blah
  //   console.log('hash change');
  //   e.preventDefault();
  //  }

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const renderPage = (route:any, navigator: Navigator) => {
    return (
      <route.comp key={route.key} navigator={navigator} openMenu={openMenu} {...route.props}/>
    );
  }

  const togggleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const openMenu = () => {
    setIsMenuOpen(true);
  }

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