import { MouseEventHandler } from "react"

export type WebtopoButtonProps = {
  className: string,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const WebtopoButton = (props: WebtopoButtonProps) => {
  return (
    <div 
      className={props.className}
      onClick={props.onTapped}
    >
    <img src="/images/goma.png"/>
    </div>
  )
}