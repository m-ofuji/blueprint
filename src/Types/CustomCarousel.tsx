import { Carousel, AnimationOptions } from "react-onsenui"

export class CustomCarousel extends Carousel{
  onSwipe?(idx:number, animationOptions: AnimationOptions): void;
}