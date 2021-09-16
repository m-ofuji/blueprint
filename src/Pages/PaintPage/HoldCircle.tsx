import { Circle } from 'react-konva';

const HoldCircle = (key: number) => {
  return <Circle
    key={key}
    fill="#00000000"
    stroke="yellow"
    radius={40}
    strokeWidth={5}
    x={window.innerWidth / 2}
    y={(window.innerHeight / 2) - 100}
    draggable={false}
  />
}

export default HoldCircle;