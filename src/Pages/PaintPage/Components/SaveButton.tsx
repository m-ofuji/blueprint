import { MouseEventHandler } from "react"

export type SaveButtonProps = {
  className: string,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const SaveButton = (props: SaveButtonProps) => {
  return (
    <div 
      className={props.className}
      onClick={props.onTapped}
    >
    <i className={'fas fa-save'}/>
    </div>
  )
}