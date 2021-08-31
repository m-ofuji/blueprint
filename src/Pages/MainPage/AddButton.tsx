import { SpeedDial, Fab, Icon, SpeedDialPosition } from 'react-onsenui';

const AddButton = ({ position }: {position: SpeedDialPosition}) => {
  return (
    <SpeedDial position={position}>
      <Fab>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
    </SpeedDial>
  )
}

export default AddButton;