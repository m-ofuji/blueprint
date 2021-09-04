import NavBar from '../MainPage/NavBar';
import { Page } from 'react-onsenui';
import { Stage, Layer, Rect, Circle, } from 'react-konva';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  return (
    <Page renderToolbar={() => <NavBar {...param}/>}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect width={50} height={50} fill="red" />
          <Circle x={200} y={200} stroke="black" radius={50} />
        </Layer>
      </Stage>
    </Page>
  )
}

export default PaintPage;