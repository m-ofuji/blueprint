import { Navigator } from 'react-onsenui';
import { Page, List, ListItem, Carousel, CarouselItem } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';


export interface HelpPage1Props {
  route: any,
  navigator: Navigator,
  id?: number;
}

const HelpPage1 = (props: HelpPage1Props) => {

  const onCloseTapped = () => props.navigator.popPage();

  return (
    <Page className={'edit-page'}>
      <div className={'page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <h3 className={'help-page-title'}>マークを追加するには</h3>
        <div className={'help-container'}>
          <Carousel
            swipeable
            overscrollable
            autoScroll
            fullscreen
            autoScrollRatio={0.2}
          >
            <CarouselItem >
              <div className='item-label'>メニューから追加したいマークを選びます。</div>
              <div className='help-image'>
                <img src='/images/help/1/1_1.png'/>
              </div>
            </CarouselItem>
            <CarouselItem >
              <div className='item-label'>追加したい場所に画像を移動し、中央の画面中央のマークをタップします。</div>
              <div className='help-image'>
                <img src='/images/help/1/1_2.png'/>
              </div>
            </CarouselItem>
            <CarouselItem >
              <div className='item-label'>マークが追加されます。</div>
              <div className='help-image'>
                <img src='/images/help/1/1_3.png'/>
              </div>
            </CarouselItem>
          </Carousel>
        </div>
      </div>
    </Page>
  )
}

export default HelpPage1;