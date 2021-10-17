import NavBar from '../NavBar';
import PaintPage from '../PaintPage/PaintPage';
import { Fab, Icon, List, ListItem, Navigator, Page } from 'react-onsenui';

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const handlePaintPage = () => {
    navigator.pushPage({comp: PaintPage, props: {navigator: navigator}});
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
    <Page key={'root'} renderToolbar={renderToolBar}>
      <div className={'section'}>
        <p className={'section-header'}>トポを作る</p>
        <div className={'start-button-container'}>
          <button className={'start-button'} onClick={handlePaintPage}>左利き<br/>向け</button>
          <button className={'start-button'} onClick={handlePaintPage}>右利き<br/>向け</button>
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