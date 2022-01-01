import { Navigator } from 'react-onsenui';
import { Page, List, ListItem, Carousel, CarouselItem } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import HelpDetailPage from './HelpDetailPage';

export interface HelpPageProps {
  route: any,
  navigator: Navigator,
  id?: number;
}

const HelpPage = (props: HelpPageProps) => {

  const onCloseTapped = () => props.navigator.popPage();

  const helpContents = {
    title: 'マークを追加するには',
    pages:[
      {
        text: 'メニューから追加したいマークを選びます。',
        img: '/images/help/1/1_1.png'
      },
      {
        text: '追加したい場所に画像を移動し、中央の画面中央のマークをタップします。',
        img: '/images/help/1/1_2.png'
      },
      {
        text: 'マークが追加されます。',
        img: '/images/help/1/1_3.png'
      }
    ]
  };

  const onHelpTapped = () => {
    props.navigator.pushPage({
      comp: HelpDetailPage,
      animation: 'none',
      props: {
        key: 'HelpDetailPage',
        route:props.route,
        navigator: props.navigator,
        contents: helpContents
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
        </div>
      </div>
    </Page>
  )
}

export default HelpPage;