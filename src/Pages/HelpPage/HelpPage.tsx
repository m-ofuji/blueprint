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
        </div>
      </div>
    </Page>
  )
}

export default HelpPage;