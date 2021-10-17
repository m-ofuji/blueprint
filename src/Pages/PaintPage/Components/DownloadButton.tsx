import { MouseEventHandler } from "react"

export type DownloadButtonProps = {
  className: string,
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const DownloadButton = (props: DownloadButtonProps) => {
  return (
    <div 
      className={props.className}
      onClick={props.onTapped}
    >
    <i className={'fas fa-download'}/>
    </div>
  )
}