import { SpeedDial, Fab, Icon, SpeedDialPosition, Navigator, SpeedDialItem, Page } from 'react-onsenui';
import PaintPage from '../PaintPage/PaintPage'

const AddButton = ({route, position, navigator }: {route: any, position: SpeedDialPosition, navigator: Navigator}) => {
  return (
    <SpeedDial position={position}>
      <Fab>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <SpeedDialItem onClick={() => navigator.pushPage('paint')}> A </SpeedDialItem>
      <SpeedDialItem onClick={() => navigator.popPage()}> B </SpeedDialItem>
    </SpeedDial>
  )
}

export default AddButton;