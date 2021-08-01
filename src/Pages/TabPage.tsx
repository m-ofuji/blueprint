import React from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import { Page, Tab, Toolbar, Tabbar } from 'react-onsenui';

class TabPage extends React.Component {
  renderTabs() {
    const page1 = {
      content: <Page1 key="tab1"/>,
      tab: <Tab key="tab1" label="Tab 1" icon="icon-home, material:md-home"></Tab>
    };
    const page2 = {
      content: <Page2 key="tab2"/>,
      tab: <Tab key="tab2" label="Tab 2" icon="md-settings"></Tab>
    };
    return [page1, page2];
  }

  onPostChange() {
    // alert("changed");
  }

  render() {
    return( 
      <Page>
        <Toolbar>
          <div className="center">Tab 1</div>
        </Toolbar>
        <Tabbar index={0} swipeable={false} renderTabs={this.renderTabs.bind(this)} onPostChange={this.onPostChange}></Tabbar>
      </Page>
    )
  }
}

export default TabPage;