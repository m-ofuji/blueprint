import HomePage from './HomePage';
import { Navigator, Page } from 'react-onsenui';

const MainPage = () => {
  const renderPage = (route:any, navigator: Navigator) => {
    return (
      <route.comp key={route.key} navigator={navigator} {...route.props}/>
    );
  }

  return (
    <Navigator
      initialRoute={{comp: HomePage, key: 'HomePage'}}
      renderPage={renderPage}
    />
  )
}

export default MainPage;