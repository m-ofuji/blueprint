import { AnimationOptions, Component } from "react-onsenui"
import React from "react"
import { HTMLAttributes } from "react-onsenui"

// export class CustomCarousel extends Carousel {
//   onSwipe?(idx:number, animationOptions: AnimationOptions): void;
// }

// export class CustomCarousel extends Carousel {
//   onSwipe?: (idx:number, animationOptions: AnimationOptions)=> void
// }

// export class CustomCarousel extends Component<Carousel {
//   onSwipe?: (idx:number, animationOptions: AnimationOptions)=> void
// }, any>{}

// export class CustomCarousel extends Component<Carousel> {}

export class Carousel extends Component<{
  direction?: "horizontal" | "vertical" | undefined,
  fullscreen?: boolean | undefined,
  overscrollable?: boolean | undefined,
  centered?: boolean | undefined,
  itemWidth?: number | string | undefined,
  itemHeight?: number | string | undefined,
  autoScroll?: boolean | undefined,
  autoScrollRatio?: number | undefined,
  swipeable?: boolean | undefined,
  disabled?: boolean | undefined,
  index?: number | undefined,
  autoRefresh?: boolean | undefined,
  onPostChange?(): void,
  onRefresh?(): void,
  onOverscroll?(): void,
  onSwipe?(idx:number, animationOptions: AnimationOptions): void,
  animationOptions?: AnimationOptions | undefined
}, any> {}

// export class CustomCarousel extends Component {
//   direction?: "horizontal" | "vertical" | undefined,
//   fullscreen?: boolean | undefined,
//   overscrollable?: boolean | undefined,
//   centered?: boolean | undefined,
//   itemWidth?: number | string | undefined,
//   itemHeight?: number | string | undefined,
//   autoScroll?: boolean | undefined,
//   autoScrollRatio?: number | undefined,
//   swipeable?: boolean | undefined,
//   disabled?: boolean | undefined,
//   index?: number | undefined,
//   autoRefresh?: boolean | undefined,
//   onPostChange?(): void,
//   onRefresh?(): void,
//   onOverscroll?(): void,
//   onSwipe?(idx:number, animationOptions: AnimationOptions): void,
//   animationOptions?: AnimationOptions | undefined
// }