import { Page, List, ListItem } from 'react-onsenui';

const SideMenu = () => {
  return (
    <Page>
      <List
        dataSource={['エクスポート', 'インポート']}
        // renderHeader={this.renderHeader}
        renderRow={(row, idx) => (
            <ListItem 
              tappable
              modifier={'longdivider'}>
              {row}
            </ListItem>
        )}
      />
    </Page>
  )
}

export default SideMenu;