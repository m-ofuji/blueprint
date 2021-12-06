import { MouseEventHandler, useState } from 'react'
import { AlertDialog, Button } from 'react-onsenui'
import ons from 'onsenui'

export type FreeTextDialogProps = {
  isOpen: boolean,
  title: string,
  msg: string,
  maxLength: number,
  onOKTapped?: (msg: string) => void
}

export const FreeTextDialog = (props: FreeTextDialogProps) => {
  const [text, setText] = useState<string>('');

  const onOKTapped = () => {
    if (!props.onOKTapped) return;
    if (text.length > 10) {
      ons.notification.alert({
        title: props.title,
        message: `${props.maxLength}文字以内で入力してください。`,
        buttonLabels: ['OK']
      });
      return;
    }

    props.onOKTapped(text);
  }

  const onChange= (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  return (
    <AlertDialog isOpen={props.isOpen} modifier='rowfooter' isCancelable={false}>
      <div className='alert-dialog-title'>{props.title}</div>
      <div className='alert-dialog-content'>
        <p>{props.msg}<br/>{`※${props.maxLength}文字まで入力できます。`}</p>
        <input className='text-input text-input--underbar' onChange={onChange} value={text} type='text' maxLength={props.maxLength * 1.5}/>
        <div style={{textAlign: 'right', marginRight: '2rem', marginTop: '0.3rem'}}>
          {text.length > props.maxLength ? '上限を超えています' : `${text.length}/${props.maxLength}`}
        </div>
      </div>
      <div className='alert-dialog-footer'>
        <Button modifier='material--flat' className='alert-dialog-button' onClick={onOKTapped}>
          OK
        </Button>
      </div>
    </AlertDialog>
  )
}