import { Navigator } from 'react-onsenui';
import { Page, List, ListItem } from 'react-onsenui';
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
          <h3 className={'page-title'}>使い方</h3>
          <List>
            <ListItem 
              key={1}
              className={'menu-item'}
              expandable
              modifier='longdivider'>
              マークを追加したい
              <div className='expandable-content'>
                メニューから追加したいマークを選びます。<br/>画面上のアイコンをタップします。
              </div>
            </ListItem>
            <ListItem 
              key={2}
              className={'menu-item'}
              expandable
              modifier='longdivider'>
              マークを消したい
              <div className='expandable-content'>
                マークをダブルタップします。
              </div>
            </ListItem>
            <ListItem 
              key={3}
              className={'menu-item'}
              expandable
              modifier='longdivider'>
              トポ画像を保存したい
              <div className='expandable-content'>
                画面左下のボタンをタップし、課題情報を入力して保存します。
              </div>
            </ListItem>
            <ListItem 
              key={4}
              className={'menu-item'}
              expandable
              modifier='longdivider'>
              画像をダウンロードしたい
              <div className='expandable-content'>
                画面左下のボタンから、画像をダウンロードできます。
              </div>
            </ListItem>
          </List>
        </div>
      </div>
    </Page>
  )
}

export default HelpPage;