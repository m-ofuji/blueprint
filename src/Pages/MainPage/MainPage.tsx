import React from 'react';
import NavBar from './NavBar';
import { Page, List, ListItem, SpeedDial, Fab, Icon } from 'react-onsenui';

class MainPage extends React.Component
{

  renderNavbar () {
    return <NavBar title='BluePrint'/>
  }

  render() {
    return (
      <Page renderToolbar={this.renderNavbar}>
        <List
            dataSource={['Row 1', 'Row 2']}
            renderRow={(row, idx) => (<ListItem key={idx} modifier='longdivider'>{row}</ListItem>)}
          />
          <SpeedDial position={'bottom right'}>
          <Fab>
            <Icon icon='fa-plus' size={26} fixedWidth={false} />
          </Fab>
        </SpeedDial>
      </Page>
    )
  }
}

// const MainPage = () => (
//   <Page renderToolbar={() => <NavBar title='BluePrint'/>}>
//     <List
//       dataSource={['Row 1', 'Row 2']}
//       renderRow={(row, idx) => (<ListItem key={idx} modifier='longdivider'>{row}</ListItem>)}
//     />
//     <SpeedDial onClick={() => {}} position={'bottom right'}>
//      <Fab>
//        <Icon icon='fa-plus' size={26} fixedWidth={false} />
//      </Fab>
//      {/* <SpeedDialItem onClick={() => console.log('speed A')}> A </SpeedDialItem>
//      <SpeedDialItem onClick={() => console.log('speed B')}> B </SpeedDialItem>
//      <SpeedDialItem onClick={() => console.log('speed C')}> C </SpeedDialItem> */}
//      {/* <SpeedDialItem onClick={() => console.log('speed D')}> D </SpeedDialItem> */}
//    </SpeedDial>
//   </Page>
// );

export default MainPage;