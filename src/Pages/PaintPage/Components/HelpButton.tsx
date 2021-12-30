import { MouseEventHandler } from "react"

export type HelpButtonProps = {
  className: string,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const HelpButton = (props: HelpButtonProps) => {
  return (
    <div 
      className={props.className}
      onClick={props.onTapped}
    >
    <i className={'far fa-question-circle'}/>
    </div>
  )
}