import { Page, List, ListItem } from 'react-onsenui';
import { TopoDB } from '../../DB/TopoDB';

const SideMenu = () => {
  const exportTopo = () => {
    const db = new TopoDB();
    
  }

  return (
    <Page>
      <List>
        <ListItem key={1} className={'menu-item'} tappable modifier='longdivider'> <i className={'fas fa-database'}/> エクスポート </ListItem>
        <ListItem key={2} className={'menu-item'} tappable modifier='longdivider'> <i className={'fas fa-file-import'}/> インポート </ListItem>
      </List>
    </Page>
  )
}

export default SideMenu;