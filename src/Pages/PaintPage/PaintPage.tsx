import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { createRef, ChangeEvent, useState } from 'react';
import { Page, SpeedDial, Fab, Icon, SpeedDialItem } from 'react-onsenui';
import { Stage, Layer, Image, Circle } from 'react-konva';
import HoldCircle from './HoldCircle';
import ResizableRectangle from './ResizableImage';

const PaintPage = () => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const initialRectangles = [
    {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 100,
      height: 100,
      fill: 'red',
      id: 'rect1',
    }
  ];

  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState<string | null>(null);

  const [wallImage, updatewallImage] = useState(new window.Image());
  const [wallImageHeight, updatewallImageHeight] = useState(0);
  const [images, setImages] = useState<number[] | null>([]);

  let count = 0;

  const selectPicture = () => {
    const option = {
      title:'壁画像選択', buttonLabels:['いいえ','はい']
    }
    ons.notification.confirm('壁の画像を選択してください。', {}).then(onAlertClose);
  }

  const ref = createRef<HTMLInputElement>()

  const onAlertClose = (index: HTMLElement) => {
    if (ref.current) {
      ref.current.click()
    }
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    
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

  const checkDeselect = (e:any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <Page onShow={selectPicture} renderToolbar={() => <NavBar {...param}/>}>
      <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
        <Layer>
          {rectangles.map((rect, i) => 
            <ResizableRectangle
              key={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => {
                selectShape(rect.id);
              }}
              onChange={(newAttrs: any) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
              }}
            />
          )}
          <Image 
            style={'aspect-fit:'}  
            width={window.innerWidth} height={wallImageHeight}
            draggable image={wallImage} 
          />
          {images?.map((image, i) => <HoldCircle key={i} {...image} />)}
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
          setImages(images != null && images != undefined ? images.concat([count++]) : null);
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