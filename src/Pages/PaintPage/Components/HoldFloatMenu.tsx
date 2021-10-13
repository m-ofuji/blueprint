import { SpeedDial, Fab, Icon, SpeedDialItem, SpeedDialPosition } from 'react-onsenui';

export class HoldFloatMenuProps {
  position: SpeedDialPosition = 'bottom right';
  onNormalClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void ) | undefined;
  onSpecialClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void )  | undefined;
  onStartClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void ) | undefined;
  onGoalClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void ) | undefined;
}

export const HoldFloatMenu = (
  {position, onNormalClick, onStartClick, onGoalClick, onSpecialClick}: HoldFloatMenuProps) => { 
  return (
    <SpeedDial position={position}>
      <Fab >
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <SpeedDialItem onClick={onNormalClick}> ○ </SpeedDialItem>
      <SpeedDialItem onClick={onSpecialClick}> ● </SpeedDialItem>
      <SpeedDialItem onClick={onStartClick}> S </SpeedDialItem>
      <SpeedDialItem onClick={onGoalClick}> G </SpeedDialItem>
    </SpeedDial>
  )
}