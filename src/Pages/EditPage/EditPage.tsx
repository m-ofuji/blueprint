import ons from 'onsenui';
import { Navigator } from 'react-onsenui';
import { ChangeEvent, useState } from 'react';
import { Page, Input, Select } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import { TopoDB } from '../../DB/TopoDB';
import { GRADES } from '../../Constants/Grades';

const EditPage = ({route, navigator, imgBlob, updateTopos}:
  {route: any, navigator: Navigator, imgBlob:Blob, updateTopos: () => void}) => {

  const [title, setTitle] = useState<string>();
  const [setter, setSetter] = useState<string>();
  const [grade, setGrade] = useState<number>(1);

  const saveTopo = () => {
    if (!title) {
      alert('課題名は必須項目です。');
      return;
    }

    if (!grade) {
      alert('グレードは必須項目です。');
      return;
    }

    const fr = new FileReader()
    fr.onload = async eve => {
      const res = fr.result;
      if (!res) return;
      const db = new TopoDB();
      db.save({
        name: title,
        grade: Number(grade),
        setter: setter,
        data: [res],
        createdAt: (new Date().getTime()) / 1000
      });
      updateTopos();
      ons.notification.alert({
        title: '保存完了',
        message: 'トポを保存しました。',
        buttonLabels: ['OK'],
        callback: () => {
          navigator.popPage();
        }
      });
    }
    fr.onerror = eve => {
      alert('保存に失敗しました。');
    }
    fr.readAsArrayBuffer(imgBlob);
  }

  const onCloseTapped = () => navigator.popPage();

  const onTitleChanged = (e: ChangeEvent<any>) => setTitle(e.target.value);
  const onSetterChanged = (e: ChangeEvent<any>) => setSetter(e.target.value);
  const onGradeChanged = (e: ChangeEvent<any>) => setGrade(e.target.value);
  const openImage = () => window.open(window.URL.createObjectURL(imgBlob));

  return (
    <Page className={'edit-page'}>
      <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
      <div id={'edit-container'}>
        <h3 className={'page-title'}><i className={'fas fa-pen'}/>課題作成</h3>
        <form id={'edit-form'}>
          <img className={'edit-image'} src={window.URL.createObjectURL(imgBlob)} alt={'画像の読み込みに失敗しました'} onClick={openImage}/>
          <p className={'edit-title'}>課題名</p>
          <Input className='edit-input' onChange={onTitleChanged}/>
          <p className={'edit-title'}>設定者</p>
          <Input className='edit-input' onChange={onSetterChanged}/>
          <p className={'edit-title'}>グレード</p>
          <Select modifier={'material'} onChange={onGradeChanged}>
            {GRADES.filter(x => x.id <= 10).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
          </Select>
        </form>
      </div>
      <button className={'edit-button'} onClick={saveTopo}>
        <i className={'fas fa-save'}/>保存
      </button>
    </Page>
  )
}

export default EditPage;