import ons from 'onsenui';
import { Navigator } from 'react-onsenui';
import { ChangeEvent, useState } from 'react';
import { Page, Input, Select } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import { TopoDB } from '../../DB/TopoDB';
import { GRADES } from '../../Constants/Grades';
import { arrayBufferToUrl } from '../../Functions/ArraybufferToUrl';

export interface EditPageProps {
  route: any,
  navigator: Navigator,
  id?: number;
  name?: string;
  setter?: string | undefined;
  grade?: number;
  data?: ArrayBuffer[];
  createdAt?: number;
  onSaved?: () => void
}

const EditPage = (props: EditPageProps) => {

  const [title, setTitle] = useState<string>(props.name ?? '');
  const [setter, setSetter] = useState<string>(props.setter ?? '');
  const [grade, setGrade] = useState<number>(props.grade ?? 1);

  const validate = () => {
    if (!title) {
      alert('課題名は必須項目です。');
      return false;
    }

    if (!grade) {
      alert('グレードは必須項目です。');
      return false;
    }

    if (!props.data || props.data.length < 0) {
      alert('課題画像は必須項目です。');
      return false;
    }

    return true;
  }

  const saveTopo = () => {
    if (!validate()) return;

    const db = new TopoDB();
    
    console.log(props.data ? new Uint8Array(props.data[0]) : 0);

    db.save({
      id:props.id,
      name: title,
      grade: Number(grade),
      setter: setter,
      data: props.data ?? [],
      createdAt: (new Date().getTime()) / 1000
    });
    ons.notification.alert({
      title: '保存完了',
      message: 'トポを保存しました。',
      buttonLabels: ['OK'],
      callback: async () => {
        if (props.onSaved) {
          props.onSaved();
        }
      }
    });
  }

  const onCloseTapped = () => props.navigator.popPage();

  const onTitleChanged = (e: ChangeEvent<any>) => setTitle(e.target.value);
  const onSetterChanged = (e: ChangeEvent<any>) => setSetter(e.target.value);
  const onGradeChanged = (e: ChangeEvent<any>) => setGrade(e.target.value);
  const openImage = (url: string) => () => window.open(url);

  return (
    <Page className={'edit-page'}>
      <div className={'page-content edit-page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <div id={'edit-container'}>
          <h3 className={'page-title'}><i className={'fas fa-pen'}/>課題作成</h3>
          <form id={'edit-form'}>
            {
              props.data?.map((x, idx) => {
                const imgUrl = arrayBufferToUrl(x);
                return <img key={idx} className={'edit-image'} src={imgUrl} alt={'画像の読み込みに失敗しました'} onClick={openImage(imgUrl)}/>;
              })
            }
            <p className={'edit-title'}>課題名</p>
            <Input className='edit-input' value={title} onChange={onTitleChanged}/>
            <p className={'edit-title'}>設定者</p>
            <Input className='edit-input' value={setter} onChange={onSetterChanged}/>
            <p className={'edit-title'}>グレード</p>
            <Select modifier={'material'} value={grade.toString()} onChange={onGradeChanged}>
              {GRADES.filter(x => x.id <= 10).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </Select>
          </form>
        </div>
        <button className={'edit-button'} onClick={saveTopo}>
          <i className={'fas fa-save'}/>保存
        </button>
      </div>
    </Page>
  )
}

export default EditPage;