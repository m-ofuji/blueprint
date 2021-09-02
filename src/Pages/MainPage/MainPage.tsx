import React from 'react';
import NavBar from './NavBar';
import ListView from './ListView';
import AddButton from './AddButton';
import { Navigator, Page } from 'react-onsenui';
import  PaintPage  from '../PaintPage/PaintPage';

class MainPage extends React.Component {
  render() {
    return (
      <Navigator renderPage={(route, navigator: Navigator) => 
        <Page key={'root'} renderToolbar={() => <NavBar title='BluePrint'/>}>
          <ListView title={'listView'} />
          <AddButton route={route} navigator={navigator} position={'bottom right'}/>
        </Page>
      } 
      initialRoute={{
        title: 'Root Page'
      }}/>
    )
  }
}

export default MainPage;