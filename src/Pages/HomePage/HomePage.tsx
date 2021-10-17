import NavBar from '../NavBar';
import PaintPage from '../PaintPage/PaintPage';
import { Fab, Icon, List, ListItem, Navigator, Page } from 'react-onsenui';

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const openRightPaintPage = () => {
    handlePaintPage(false);
  }

  const openLeftyPaintPage = () => {
    handlePaintPage(true);
  }
  
  const handlePaintPage = (isLefty: boolean) => {
    navigator.pushPage({comp: PaintPage, props: {isLefty: isLefty, navigator: navigator}});
  }

  const renderToolBar = () => {
    const param = {
      title: 'BluePrint',
      barTextColor: '#ffffff',
      barBackgroundColor: '#004898',
      hasBackButton: false
    }
    return <NavBar {...param}/>
  }

  return (
    <Page key={'root'}>
      <div className={'section'}>
        <p className={'section-header'}>トポを作る</p>
        <div className={'start-button-container'}>
          <button className={'start-button'} onClick={openLeftyPaintPage}>左利き<br/>向け</button>
          <button className={'start-button'} onClick={openRightPaintPage}>右利き<br/>向け</button>
        </div>
      </div>
      
      <p className={'section-header'}>作成したトポ</p>
      <div className={'start-button-container'}>
        <h3>coming soon</h3>
      </div>
    </Page>
  )
}

export default HomePage;