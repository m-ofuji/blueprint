import { Navigator } from 'react-onsenui';
import { Page } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import HelpDetailPage from './HelpDetailPage';
import { HelpContents, HELP_CONTENTS } from './HelpContents';

export interface HelpPageProps {
  route: any,
  navigator: Navigator,
  id?: number;
}

const HelpPage = (props: HelpPageProps) => {

  const onCloseTapped = () => props.navigator.popPage();

  const onHelpTapped = (contents: HelpContents) => {
    return () =>{
      props.navigator.pushPage({
        comp: HelpDetailPage,
        animation: 'none',
        props: {
          key: 'HelpDetailPage',
          route:props.route,
          navigator: props.navigator,
          contents: contents
        }
      });
    }
  }

  return (
    <Page className={'edit-page'}>
      <div className={'page-content edit-page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <div id={'edit-container'}>
          <h3 className={'page-title'}>使い方</h3>
          {HELP_CONTENTS.map(x => 
            <div
              className={'help-menu-button'}
              onClick={onHelpTapped(x)}>
              {x.buttonTitle}
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

export default HelpPage;