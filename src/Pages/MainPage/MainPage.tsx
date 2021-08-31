import React from 'react';
import NavBar from './NavBar';
import ListView from './ListView';
import AddButton from './AddButton';
import { Navigator, Page } from 'react-onsenui';

class MainPage extends React.Component
{

  renderNavbar () {
    return <NavBar title='BluePrint'/>
  }

  renderPage (route: any, navigator: Navigator) {
    return 
  }

  render() {
    return (
      <Navigator renderPage={(route, navigator) => 
        <Page key={'root'} renderToolbar={() => <NavBar title='BluePrint'/>}>
          <ListView title={'listView'} />
          <AddButton position={'bottom right'}/>
        </Page>
      } 
      initialRoute={{
        title: 'Root Page'
      }}/>
    )
  }
}

export default MainPage;