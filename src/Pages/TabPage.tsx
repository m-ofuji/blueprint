import React from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import { Page, Tab, Toolbar, Tabbar } from 'react-onsenui';

class TabPage extends React.Component {
  state = { 
    title: 'Tab 1',
    index: 0
  }

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
  // Title: string = 'a';

  onPostChange() {
    console.log(this);
  }

  render() {
    return( 
      <Page>
        <Toolbar>
          <div className="center">{this.state.title}</div>
        </Toolbar>
        <Tabbar index={this.state.index} swipeable={false} renderTabs={this.renderTabs.bind(this)} onPostChange={this.onPostChange}></Tabbar>
      </Page>
    )
  }
}

export default TabPage;