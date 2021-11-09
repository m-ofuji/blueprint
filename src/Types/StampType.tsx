export interface IStampButton {
  key: number, 
  label: string,
  isSelected: boolean, 
  onTapped: () => void
}

export interface IHoldStamp extends IStampButton {
  color: string
}

export interface ITextStamp extends IStampButton {
  contentText: string
}

export const isIHoldStamp = (arg: unknown): arg is IHoldStamp =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as IHoldStamp).key === 'number' &&
    typeof (arg as IHoldStamp).label === 'string' &&
    typeof (arg as IHoldStamp).isSelected === 'boolean' &&
    typeof (arg as IHoldStamp).color === 'string';

export const isITextStamp = (arg: unknown): arg is ITextStamp =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as ITextStamp).key === 'number' &&
    typeof (arg as ITextStamp).label === 'string' &&
    typeof (arg as ITextStamp).isSelected === 'boolean' &&
    typeof (arg as ITextStamp).contentText === 'string';