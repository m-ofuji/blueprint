import { MouseEventHandler } from "react"

export type RoundButtonProps = {
  text: string,
  isSelected: boolean,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const RoundButton = (props: RoundButtonProps) => {
  return (
    // <li className={'button-li'}>
      <div
        className={props.isSelected ? 'round-button selected' : 'round-button' }
        onClick={props.onTapped}
      >
        {props.text}
      </div>
    // </li>
    
  )
}