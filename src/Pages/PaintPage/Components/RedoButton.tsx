import { MouseEventHandler } from "react"

export type RedoButtonProps = {
  disabled: boolean,
  onTapped: MouseEventHandler<HTMLButtonElement>
}

export const RedoButton = (props: RedoButtonProps) => {
  return (
    <button 
      className={props.disabled ? 'redo-button disabled' : 'redo-button'}
      onClick={props.onTapped}
      disabled={props.disabled}
    >
    <i className={'fas fa-chevron-right'}/>
    </button>
  )
}