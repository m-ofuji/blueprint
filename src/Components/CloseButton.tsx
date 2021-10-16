import { MouseEventHandler } from "react"

export type CloseButtonProps = {
  className: string,
  onTapped: MouseEventHandler<HTMLButtonElement>
}

export const CloseButton = (props: CloseButtonProps) => {
  return (
    <button 
      className={props.className}
      // onClick={props.onTapped}
      onClick={props.onTapped}
    >
    <i className={'fas fa-times'}/>
    </button>
  )
}