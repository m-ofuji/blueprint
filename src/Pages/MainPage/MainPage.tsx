import NavBar from './NavBar';
import { Page, List, ListItem } from 'react-onsenui';

const MainPage = () => (
  <Page renderToolbar={() => <NavBar title='BluePrint'/>}>
    <List
      dataSource={['Row 1', 'Row 2']}
      renderRow={(row, idx) => (<ListItem key={idx} modifier='longdivider'>{row}</ListItem>)}
    />
  </Page>
);

export default MainPage;