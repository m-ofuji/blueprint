import { MouseEventHandler } from "react"

export type UndoButtonProps = {
  disabled:boolean,
  onTapped: MouseEventHandler<HTMLButtonElement>
}

export const UndoButton = (props: UndoButtonProps) => {
  return (
    <button 
      className={props.disabled ? 'undo-button disabled' : 'undo-button'}
      // onClick={props.onTapped}
      onClick={props.onTapped}
      disabled={props.disabled}
    >
    <i className={'fas fa-chevron-left'}/>
    </button>
  )
}