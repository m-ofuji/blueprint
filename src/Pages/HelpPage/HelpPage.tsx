import { Navigator } from 'react-onsenui';
import { Page, List, ListItem, Carousel, CarouselItem } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import HelpPage1 from './HelpPage1';


export interface HelpPageProps {
  route: any,
  navigator: Navigator,
  id?: number;
}

const HelpPage = (props: HelpPageProps) => {

  const onCloseTapped = () => props.navigator.popPage();


  const onHelpTapped = () => {
    props.navigator.pushPage({
      comp: HelpPage1,
      animation: 'none',
      props: {
        key: 'HelpPage1',
        route:props.route,
        navigator: props.navigator
      }
    });
  }

  return (
    <Page className={'edit-page'}>
      <div className={'page-content edit-page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <div id={'edit-container'}>
          <h3 className={'page-title'}>使い方</h3>
          <div
            className={'help-menu-button'}
            onClick={onHelpTapped}>
            マークを追加したい
          </div>
          <div
            className={'help-menu-button'}
            onClick={onHelpTapped}>
            マークを削除したい
          </div>
          <div
            className={'help-menu-button'}
            onClick={onHelpTapped}>
            トポ画像を保存したい
          </div>
          <div
            className={'help-menu-button'}
            onClick={onHelpTapped}>
            トポ画像をダウンロードしたい
          </div>
          {/* <List>
            <ListItem 
              key={1}
              className={'menu-item'}
              expandable
              modifier='longdivider'>
              マークを追加したい
              <div className='expandable-content'>
                <Carousel
                  swipeable
                  overscrollable
                  autoScroll
                  fullscreen
                  autoScrollRatio={0.5}
                  index={2}
                >
                  <CarouselItem >
                    <img src='/images/help/1/1_1.png'/>
                    <div className='item-label'>メニュから追加したいマークを選びます。</div>
                  </CarouselItem>
                  <CarouselItem >
                    <img src='/images/help/1/1_2.png'/>
                    <div className='item-label'>メニュから追加したいマークを選びます。</div>
                  </CarouselItem>
                </Carousel>
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
          </List> */}
        </div>
      </div>
    </Page>
  )
}

export default HelpPage;