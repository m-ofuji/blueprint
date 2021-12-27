import { MouseEventHandler } from "react"

export type RotateButtonProps = {
  className: string,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const RotateButton = (props: RotateButtonProps) => {
  return (
    <div 
      className={props.className}
      onClick={props.onTapped}
    >
    <i className={'fas fa-redo'}/>
    </div>
  )
}