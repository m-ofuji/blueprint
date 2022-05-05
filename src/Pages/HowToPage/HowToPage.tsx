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
  const [shownContent, setShownContent] = useState<string>('add-mark');

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
      {shownContent === 'zoom' && 
        <div className="how-to how-to-zoom">
          <h5 className="how-to-title"><span/>画像の拡大・縮小</h5>
          <div className="how-to-zoom-img-wrapper">
            <img className="how-to-zoom-img" src="/images/howto/pinch.png"/>
          </div>
          <p>
            ピンチイン・ピンチアウトで画像の縮小・拡大ができます。
          </p>
          <div className="how-to-ok-button">OK</div>
        </div>
      }
      {shownContent === 'add-mark' && 
        <div className="how-to how-to-add-mark">
          <h5 className="how-to-title"><span/>マークを付ける</h5>
          <p>
            使用するホールドが画面中央の〇マークに収まるように画像を移動します。<br/>位置が決まったら、マークをタップします。
          </p>
          <div className="how-to-ok-button">OK</div>
        </div>
      }
      {shownContent === 'remove-mark' && 
        <div className="how-to how-to-remove-mark">
          <h5 className="how-to-title"><span/>マークを消す</h5>
          <p>
            間違えたときは、マークをダブルタップすることで、マークを消します。
          </p>
          <div className="how-to-ok-button">OK</div>
        </div>
      }
    </>
  )
}

export default HowToOverlay;