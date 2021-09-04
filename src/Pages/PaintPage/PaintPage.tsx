import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent } from 'react';
import { Page, SpeedDial, Fab, Icon, SpeedDialItem } from 'react-onsenui';
import { Stage, Layer, Rect, Circle } from 'react-konva';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const selectPicture = () => {
    const option = {
      title:'壁画像選択', buttonLabels:['いいえ','はい']
    }
    ons.notification.confirm('壁の画像を選択してください。', {}).then(onAlertClose);
  }

  // ref.current.onchange((a,b) => {});
  const ref = createRef<HTMLInputElement>()

  const onAlertClose = (index:HTMLElement) => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
if (event.target.files === null) {
      return
    }
    const file = event.target.files.item(0)
    if (file === null) {
      return
    }
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log(reader.result as string)
    }
  }

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect width={50} height={50} fill="red" />
          <Circle x={200} y={200} stroke="black" radius={50} />
        </Layer>
      </Stage>
      <SpeedDial position={'bottom right'}>
        <Fab >
          <Icon icon='fa-plus' size={26} fixedWidth={false} />
        </Fab>
        <SpeedDialItem > ○ </SpeedDialItem>
        <SpeedDialItem > S </SpeedDialItem>
        <SpeedDialItem > G </SpeedDialItem>
        <SpeedDialItem > F </SpeedDialItem>
      </SpeedDial>
      <input
        onChange={onChange}
        ref={ref}
        style={{ display: 'none' }}
        type={'file'}
      />
    </Page>
  )
}

export default PaintPage;