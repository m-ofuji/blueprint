import { ProgressCircular } from "react-onsenui";

export const LoadingOverlay = ({isVisible}: {isVisible: boolean}) => {
  return (
    <div className={`loading-overlay${isVisible ? '' : ' hidden'}`}>
      <div className={'circle'}>
        <ProgressCircular indeterminate />
      </div>
      <div className={'text'}>
        <p>Loading...</p>
      </div>
    </div>
  )
}