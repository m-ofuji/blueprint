import { MouseEvent } from "react"

export type RoundButtonProps = {
  label: string,
  isSelected: boolean,
  onTapped: (e: MouseEvent<HTMLDivElement>) => void
}

export const RoundButton = (props: RoundButtonProps) => {
  return (
    <div
      className={`round-button${props.isSelected ?' selected' : ''}` }
      onClick={props.onTapped}
    >
      {props.label}
    </div>
  )
}