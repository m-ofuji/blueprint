import NavBar from '../MainPage/NavBar';
import ons from 'onsenui'
import { Navigator } from 'react-onsenui';
import { createRef, ChangeEvent, useState, useRef, useEffect, useLayoutEffect} from 'react';
import { Page, Fab, Icon } from 'react-onsenui';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage, Layer, Group } from 'react-konva';
import { ResizableImage } from './ResizableImage';
import { downloadURI } from './DownloadUri';
import { HoldFloatMenu } from './HoldFloatMenu';
import { NormalTarget } from './Targets/NormalTarget';
import { TextTarget } from './Targets/TextTarget';
import { RoundButton } from '../../Components/RoundButton';

export type SizeProps = {
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  width: number,
  height: number
}

const PaintPage = ({route, navigator}: {route: any, navigator: Navigator}) => {

  const param = {
    title: 'PaintPage',
    barTextColor: '#000000',
    barBackgroundColor: '#ffffff',
    hasBackButton: true
  }

  const sizeProps = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    width: window.innerWidth,
    height: window.innerHeight * 0.8
  };

  const [wallImage, setWallImage] = useState<CanvasImageSource | null>(null);
  const [stageSizeProps, setStageSizeProps] = useState<SizeProps>(sizeProps);
  const [imageSizeProps, setImageSizeProps] = useState<SizeProps>(sizeProps);
  const [isImageLoaded, updateIsImageLoaded] = useState<boolean>(false);
  const [execDownload, updateExecDownload] = useState<boolean>(false);
  // const [circleColor, setCircleColor] = useState<string>('yellow');
  const [selectedButton, updateSelectedButton] = useState<boolean[]>([true, false, false, false]);
  const [holdText, setHoldText] = useState<string>('S');

  const initialButton = [
    { text: 'ホールド', isSelected: selectedButton[0], onTapped: () => activateHoldTarget(0) },
    { text: 'S・Gホールド', isSelected: selectedButton[1], onTapped: () => activateHoldTarget(1) },
    { text: 'Sマーク', isSelected: selectedButton[2], onTapped: () => activateTextTarget(2) },
    { text: 'Gマーク', isSelected: selectedButton[3], onTapped: () => activateTextTarget(3) }
  ];

  const stage = useRef<any>(null);
  const resizableImage = useRef<any>(null);
  
  const ref = createRef<HTMLInputElement>();

  const selectPicture = () => {
    if (ref.current && !isImageLoaded) {
      ref.current.click();
    }

    // const option = {
    //   title:'壁画像選択', buttonLabels:['OK']
    // }
    // ons.notification.confirm('壁の画像を選択してください。', option).then(onAlertClose);
  }

  const onAlertClose = (index: HTMLElement) => {
    if (ref.current) {
      ref.current.click();
    }
  }

  useLayoutEffect(()=> {
    selectPicture();
  });

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;

    const file = event.target.files.item(0);

    if (file === null) return;

    const dataURL = URL.createObjectURL(file);
    const i = new window.Image();
    i.src = dataURL;
    setWallImage(i);
    i.onload = (evt) => {
      setImageSizeProps((old) => { return { ...old, width: i.width, height: i.height } });
    }
    updateIsImageLoaded(true);
  }

  const download = () => {
    if (!execDownload) return;
    const maxSideLength = 600;
    const fixPixelRatio = imageSizeProps.width > maxSideLength || imageSizeProps.height > maxSideLength;
    const pixelRatio = fixPixelRatio ? maxSideLength / Math.max(imageSizeProps.width, imageSizeProps.height) : 1;
    const uri = stage.current.toDataURL({pixelRatio: pixelRatio});

    downloadURI(uri, "topo.png");

    navigator.popPage();
  };

  useEffect(download);

  const handleExport = () => {
    if (!stage) return;

    // updateHoldTargetVisibility(false);
    // updateTextTargetVisibility(false);

    setStageSizeProps((old) => {
      return {...old, 
        width: imageSizeProps.width,
        height: imageSizeProps.height,
        x: imageSizeProps.x,
        y: imageSizeProps.y,
        scaleX: imageSizeProps.scaleX,
        scaleY: imageSizeProps.scaleY
      };
    });

    updateExecDownload(true);
  };

  const activateHoldTarget = (index:number) => {
    // updateHoldTargetVisibility(true);
    
    // updateTextTargetVisibility(false);
    
    const selected = [false, false, false, false];
    selected[index] = true;
    updateSelectedButton(selected);

    const color = getHoldColor(selectedButton);
    console.log(color);
    if (!color) return;
    // setCircleColor(color);
    
    // updateSelectedButton((old) => { return {...[false, false, false, false], index: true}});
  }

  const activateTextTarget = (index:number) => {
    // updateHoldTargetVisibility(false);
    // updateTextTargetVisibility(true);
    
    const selected = [false, false, false, false];
    selected[index] = true;
    updateSelectedButton(selected);
    console.log(selected);
    const text = getText(selectedButton);
    console.log(text);
    if (!text) return;
    setHoldText(text);
  }

  const getHoldColor = (selected: boolean[]) => {
    const index = selected.findIndex((val, i) => val);
    console.log(index);
    if (index >= 2 || index < 0) return undefined;
    return index === 0 ? 'yellow' : 'red';
  }

  const getText = (selected: boolean[]) => {
    const index = selected.findIndex((val, i) => val);
    console.log(index);
    if (index <= 1) return undefined;
    return index === 2 ? 'S' : 'G';
  }

  const holdTargetTapped = (evt: KonvaEventObject<Event>) => {
    const color = getHoldColor(selectedButton);
    if (!color) return;
    resizableImage.current.useHold(color)
  }

  const textTargetTapped = (evt: KonvaEventObject<Event>) => {
    const text = getText(selectedButton);
    if (!text) return;
    resizableImage.current.useHoldText(text)
  }

  return (
    <Page 
      renderToolbar={() => <NavBar {...param}/>}>
      <Stage 
        offsetX={stageSizeProps.x}
        offsetY={stageSizeProps.y}
        scaleX={stageSizeProps.scaleX}
        scaleY={stageSizeProps.scaleY}
        width={stageSizeProps.width} 
        height={stageSizeProps.height}
        ref={stage}
      >
        <Layer>
          <Group draggable>
            <ResizableImage
              ref={resizableImage}
              src={wallImage ?? undefined}
              key={'wallImage'}
              centerX={window.innerWidth / 2}
              centerY={window.innerHeight / 2}
              updateSizeProps={setImageSizeProps}
            />
          </Group>
          <NormalTarget
            x={window.innerWidth / 2 - stageSizeProps.x}
            y={window.innerHeight / 2 - stageSizeProps.y}
            isVisible={selectedButton[0] || selectedButton[1]}
            onTapped={holdTargetTapped}
          />
          <TextTarget
            x={window.innerWidth / 2 - stageSizeProps.x}
            y={window.innerHeight / 2 - stageSizeProps.y}
            character={holdText}
            isVisible={selectedButton[2] || selectedButton[3]}
            onTapped={textTargetTapped}
          />
        </Layer>
      </Stage>
      <Fab onClick={handleExport} position={'bottom left'}>
        <Icon icon='fa-plus' size={26} fixedWidth={false} />
      </Fab>
      <div className={'horizontal-container'}>
        {initialButton.map((props, i) => <RoundButton {...props}/>)}
        
        {/* <RoundButton isSelected={selectedButton[0]} text='ホールド' onTapped={() => activateHoldTarget(0)} />
        <RoundButton isSelected={selectedButton[1]} text='S・Gホールド' onTapped={() => activateHoldTarget(1)} />
        <RoundButton isSelected={selectedButton[2]} text='Sマーク' onTapped={() => activateTextTarget(2)} />
        <RoundButton isSelected={selectedButton[3]} text='Gマーク' onTapped={() => activateTextTarget(3)} /> */}
      </div>
      <input
        onChange={onChange}
        ref={ref}
        style={{ display: 'none' }}
        type='file'
        accept='image/*'
      />
    </Page>
  )
}

export default PaintPage;