import NavBar from './NavBar';
import PaintPage from '../PaintPage/PaintPage';
import { SpeedDial, Fab, Icon, List, ListItem, Navigator, SpeedDialItem, Page } from 'react-onsenui';

const HomePage = ({route, navigator}: {route: any, navigator: Navigator}) => {
  const handlePaintPage = () => {
    navigator.pushPage({comp: PaintPage, key: 'Page2'});
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
      <List
        dataSource={['Row 1', 'Row 2']}
        renderRow={(row, idx) => (<ListItem key={idx} modifier='longdivider'>{row}</ListItem>)}
      />
      <SpeedDial position={'bottom right'}>
      <Fab>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <SpeedDialItem onClick={handlePaintPage}> A </SpeedDialItem>
      <SpeedDialItem onClick={() => navigator.popPage()}> B </SpeedDialItem>
    </SpeedDial>
    </Page>
  )
}

export default HomePage;