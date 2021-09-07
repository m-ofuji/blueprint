import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState } from 'react';
import { Page, SpeedDial, Fab, Icon, SpeedDialItem } from 'react-onsenui';
import { Stage, Layer, Image, Circle } from 'react-konva';

const GreenCircle = (k:number) => {
  return <Circle key={k} x={200 + k} y={100} radius={50} fill="green" />
}

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const [wallImage, updatewallImage] = useState(new window.Image());
  const [wallImageHeight, updatewallImageHeight] = useState(0);
  const [images, setImages] = useState([0]);

  let count = 0;

  const selectPicture = () => {
    const option = {
      title:'壁画像選択', buttonLabels:['いいえ','はい']
    }
    ons.notification.confirm('壁の画像を選択してください。', {}).then(onAlertClose);
  }

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

    const dataURL = URL.createObjectURL(file);
    const i = new window.Image();
    i.src = dataURL;
    updatewallImage(i);
    i.onload = () => {
      updatewallImageHeight(window.innerWidth * (i.naturalHeight / i.naturalWidth));  
    }
  }

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Image 
            style={'aspect-fit:'}  
            width={window.innerWidth} height={wallImageHeight}
            draggable image={wallImage} 
          />
          {images.map((image) => {
              return <GreenCircle {...image} />;
          })}
          {/* <Circle x={200} y={100} radius={50} fill="green" /> */}
        </Layer>
      </Stage>
      <SpeedDial position={'bottom right'}>
        <Fab >
          <Icon icon='fa-plus' size={26} fixedWidth={false} />
        </Fab>
        <SpeedDialItem > ○ </SpeedDialItem>
        <SpeedDialItem > S </SpeedDialItem>
        <SpeedDialItem > G </SpeedDialItem>
        <SpeedDialItem onClick={() => {
          console.log('aaa');
          setImages(images.concat([count++]));
        }}> F </SpeedDialItem>
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