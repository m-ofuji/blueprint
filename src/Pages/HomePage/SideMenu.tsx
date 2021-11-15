import { Page, List, ListItem } from 'react-onsenui';
import { TopoDB } from '../../DB/TopoDB';
import { downloadBlob } from '../../Functions/DownloadBlob';

const SideMenu = () => {
  const exportTopo = async () => {
    const db = new TopoDB();
    const blob = await db.exportTopos();
    downloadBlob(blob);
  }

  return (
    <Page>
      <List>
        <ListItem
          key={1}
          className={'menu-item'}
          tappable
          onClick={exportTopo}
          modifier='longdivider'>
            <i className={'fas fa-database'}/> バックアップ保存
        </ListItem>
        <ListItem 
          key={2}
          className={'menu-item'}
          tappable
          modifier='longdivider'>
            <i className={'fas fa-file-import'}/> インポート
        </ListItem>
      </List>
    </Page>
  )
}

export default SideMenu;