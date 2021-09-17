import { SpeedDial, Fab, Icon, SpeedDialItem, SpeedDialPosition } from 'react-onsenui';

export class HoldFloatMenuProps {
  position: SpeedDialPosition = 'bottom right';
  onNormalClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void ) | undefined;
  onStartClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void ) | undefined;
  onGoalClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void ) | undefined;
  onFootClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void )  | undefined;
}

export const HoldFloatMenu = (
  {position, onNormalClick, onStartClick, onGoalClick, onFootClick}: HoldFloatMenuProps) => { 
  return (
    <SpeedDial position={position}>
      <Fab >
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <SpeedDialItem onClick={onNormalClick}> ○ </SpeedDialItem>
      <SpeedDialItem onClick={onStartClick}> S </SpeedDialItem>
      <SpeedDialItem onClick={onGoalClick}> G </SpeedDialItem>
      <SpeedDialItem onClick={onFootClick}> F </SpeedDialItem>
    </SpeedDial>
  )
}