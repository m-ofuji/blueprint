import { MouseEventHandler } from "react"
import { Icon } from "react-onsenui"

export type DownloadButtonProps = {
  onTapped: MouseEventHandler<HTMLDivElement>
}

export const DownloadButton = (props: DownloadButtonProps) => {
  return (
    <div 
      className={'download-button' }
      onClick={props.onTapped}
    >
    <i className={'fas fa-download'}/>
    </div>
  )
}