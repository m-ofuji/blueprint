import { SpeedDial, Fab, Icon, SpeedDialPosition, Navigator, SpeedDialItem, Page } from 'react-onsenui';
import { Stage, Layer, Rect, Circle } from 'react-konva';

const AddButton = ({route, position, navigator}: {route: any, position: SpeedDialPosition, navigator: Navigator}) => {
  const page = () => {return(
    <Page>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect width={50} height={50} fill="red" />
          <Circle x={200} y={200} stroke="black" radius={50} />
        </Layer>
      </Stage>
    </Page>
  )}
  
  return (
    <SpeedDial position={position}>
      <Fab>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <SpeedDialItem onClick={() => navigator.pushPage({Component:page})}> A </SpeedDialItem>
      <SpeedDialItem onClick={() => navigator.popPage()}> B </SpeedDialItem>
    </SpeedDial>
  )
}

export default AddButton;