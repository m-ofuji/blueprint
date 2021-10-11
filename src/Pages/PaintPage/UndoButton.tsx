import { MouseEventHandler } from "react"

export type UndoButtonProps = {
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const UndoButton = (props: UndoButtonProps) => {
  return (
    <div 
      className={'undo-button' }
      onClick={props.onTapped}
    >
    <i className={'fas fa-download'}/>
    </div>
  )
}