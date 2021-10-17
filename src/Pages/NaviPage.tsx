import HomePage from './HomePage/HomePage';
import { Navigator, Page } from 'react-onsenui';

export const NaviPage = () => {
  const renderPage = (route:any, navigator: Navigator) => {
    return (
      <route.comp key={route.key} navigator={navigator} {...route.props}/>
    );
  }

  return (
    <Navigator
      key={'navi'}
      initialRoute={{comp: HomePage, key: 'HomePage'}}
      renderPage={renderPage}
    />
  )
}