import { MouseEventHandler } from "react"

export type RectangleButtonProps = {
  key: number,
  label: string,
  isSelected: boolean,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const RectangleButton = (props: RectangleButtonProps) => {
  return (
    <div
      className={`rectangle-button${props.isSelected ? ' selected' : ''}`}
      onClick={props.onTapped}
    >
      {props.label}
    </div>
  )
}