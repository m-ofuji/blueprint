// import {  } from 'react-onsenui';
import { Navigator, Page, CarouselItem, CustomCarousel } from 'react-onsenui';
// import { CustomCarousel } from '../../Types/CustomCarousel';
// import { Carousel } from '../../@types/CustomCarousel';
// import { Carousel } from '../../@types/react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import { useState } from 'react';
import { AnimationOptions } from 'react-onsenui';
import { HelpContents } from './HelpContents';

export interface HelpDetailPageProps {
  route: any,
  navigator: Navigator,
  id?: number,
  contents: HelpContents
}

const HelpDetailPage = (props: HelpDetailPageProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [swipedIndex, setSwipedIndex] = useState<number>(0);

  const onCloseTapped = () => props.navigator.popPage();

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
    <Page className={'edit-page'}>
      <div className={'page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <h3 className={'help-page-title'}>{props.contents.title}</h3>
        <div className='help-container'>
          <CustomCarousel
            swipeable
            overscrollable
            autoScroll
            autoScrollRatio={0.2}
            index={selectedIndex}
            onPostChange={onPostChange}
            onSwipe={onSwipe}
          >
            {props.contents.pages.map((x, idx) => 
              <CarouselItem key={idx}>
                <div className='item-label'>{x.text}</div>
                <div className='help-image'>
                  <img src={x.img} alt={'画像が見つかりませんでした。'}/>
                </div>
              </CarouselItem>
            )}
          </CustomCarousel>
        </div>
        <div className={'help-footer'}>
          <div onClick={prev}>
            <i className={`fas fa-chevron-left fa-lg${selectedIndex <= 0 ? ' hidden' : ''}`}></i>
          </div>
          {props.contents.pages.map((x, idx) => 
            <div key={idx}>
              <i className={`fas fa-circle fa-xs${idx === selectedIndex ? ' help-selected-dot' : ''}`}></i>
            </div>
          )}
          <div onClick={next}>
            <i className={`fas fa-chevron-right fa-lg${(selectedIndex + 1) < props.contents.pages.length ? '' : ' hidden'}`}></i>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default HelpDetailPage;