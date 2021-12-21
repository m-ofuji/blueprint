import { Navigator } from 'react-onsenui';
import { Page, List, ListItem, Input, Select } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';


export interface HelpPageProps {
  route: any,
  navigator: Navigator,
  id?: number;
}

const HelpPage = (props: HelpPageProps) => {

  const onCloseTapped = () => props.navigator.popPage();

  return (
    <Page className={'edit-page'}>
      <div className={'page-content edit-page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <div id={'edit-container'}>
          <h3 className={'page-title'}><i className={'fas fa-pen'}/>使い方</h3>
          <List>
            <ListItem
              key={1}
              className={'menu-item'}
              tappable
              // onClick={exportTopo}
              modifier='longdivider'>
                <i className={'fas fa-database'}/> バックアップ保存
            </ListItem>
            <ListItem 
              key={2}
              className={'menu-item'}
              tappable
              expandable
              modifier='longdivider'>
                <i className={'fas fa-file-import'}/> インポート
              <div className='expandable-content'>コンテント</div>
            </ListItem>
          </List>
        </div>
      </div>
    </Page>
  )
}

export default HelpPage;