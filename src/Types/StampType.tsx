import { MouseEvent } from "react";

export interface IStampButton {
  key: number, 
  label: string,
  isSelected: boolean, 
  onTapped: (e: MouseEvent<HTMLDivElement>) => void
}

export interface IHoldStamp extends IStampButton {
  holdColor: string
}

export interface ITextStamp extends IStampButton {
  contentText: string,
  fontSize: number,
  textColor: string
}

export const isIHoldStamp = (arg: unknown): arg is IHoldStamp =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as IHoldStamp).key === 'number' &&
    typeof (arg as IHoldStamp).label === 'string' &&
    typeof (arg as IHoldStamp).isSelected === 'boolean' &&
    typeof (arg as IHoldStamp).holdColor === 'string';

export const isITextStamp = (arg: unknown): arg is ITextStamp =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as ITextStamp).key === 'number' &&
    typeof (arg as ITextStamp).label === 'string' &&
    typeof (arg as ITextStamp).isSelected === 'boolean' &&
    typeof (arg as ITextStamp).contentText === 'string' &&
    typeof (arg as ITextStamp).fontSize === 'number' &&
    typeof (arg as ITextStamp).textColor === 'string';