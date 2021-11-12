import { MouseEventHandler } from "react"

export type UndoButtonProps = {
  disabled:boolean,
  onTapped: MouseEventHandler<HTMLButtonElement>
}

export const UndoButton = (props: UndoButtonProps) => {
  return (
    <button 
      className={props.disabled ? 'undo-button disabled hidden' : 'undo-button hidden'}
      onClick={props.onTapped}
      disabled={props.disabled}
    >
    <i className={'fas fa-chevron-left'}/>
    </button>
  )
}