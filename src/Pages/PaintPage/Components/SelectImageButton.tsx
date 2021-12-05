import { MouseEventHandler } from "react"

export type SelectImageButtonProps = {
  isVisible: boolean,
  onTapped: MouseEventHandler<HTMLButtonElement>
}

export const SelectImageButton = (props: SelectImageButtonProps) => {
  return (
    <button 
      className={`select-image-button${props.isVisible ? '' : ' hidden'}`} 
      onClick={props.onTapped}>
      壁の画像を選択する
    </button>
  )
}