import { Carousel } from 'react-onsenui';
import { Navigator, Page, CarouselItem, CustomCarousel } from 'react-onsenui';
// import { CustomCarousel } from '../../Types/CustomCarousel';
// import { Carousel } from '../../@types/CustomCarousel';
// import { Carousel } from '../../@types/react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import { useState } from 'react';
import { AnimationOptions } from 'react-onsenui';
// import { HelpContents } from './HelpContents';

export interface HowToOverlayProps {
  // route: any,
  // navigator: Navigator,
  // id?: number,
  // contents: HelpContents
  isShown: boolean,
  hide:() => void
}

const HowToOverlay = (props: HowToOverlayProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [swipedIndex, setSwipedIndex] = useState<number>(0);

  // const onCloseTapped = () => props.navigator.popPage();

  const prev = () => setSelectedIndex(old => old - 1);
  const next = () => setSelectedIndex(old => old + 1);

  const onPostChange = () => {
    if (selectedIndex !== swipedIndex) {
      setSelectedIndex(Math.floor(swipedIndex));
    }
  };

  const onSwipe = (idx:number, animationOptions: AnimationOptions) => {
    if(idx % 1 === 0 && swipedIndex !== idx){
      setSwipedIndex(old => idx);
    }
  }

  return (
    <>
      <div className="how-to-zoom">
        <div className="how-to-zoom-img-wrapper">
          <img className="how-to-zoom-img" src="/images/howto/pinch.png"/>
        </div>
        <p>
          ピンチイン・ピンチアウトで画像の縮小・拡大ができます。
        </p>
        {/* <button>OK</button> */}
        <div className="how-to-ok-button">OK</div>
      </div>
    </>
  )
}

export default HowToOverlay;