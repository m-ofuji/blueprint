import React from 'react';
import NavBar from './MainPage/NavBar';
import { Page, List, ListItem, Button, ListHeader } from 'react-onsenui';

class Page1 extends React.Component {
  state = { 
    data: [1,2,3,4,5,6,7],
    index: 0
  }

  render() {
    return(
      // <Page renderToolbar={() => <NavBar title="BluePrint">
      <Page renderToolbar={() => <NavBar title="BluePrint"/>}>
        <List 
          dataSource={['Row 1', 'Row 2']}
          // renderHeader={this.renderHeader}
          renderHeader={() =>
            <ListHeader style={{fontSize: 15}} className="testClass"> Header Text </ListHeader> }
          renderRow={(row, idx) => (
            // <ListItem modifier={idx === this.state.data.length - 1 ? 'longdivider' : null}>
            <ListItem modifier='longdivider'>
              {row}
              <Button modifier="quiet" >Remove</Button>
            </ListItem>
          )}
        // renderFooter={this.renderFooter}
        />
      </Page>
    )
  }
}

export default Page1;