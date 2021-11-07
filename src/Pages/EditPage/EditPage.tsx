import ons from 'onsenui';
import { Navigator } from 'react-onsenui';
import { ChangeEvent, useState, useEffect } from 'react';
import { Page, Input, Select } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import { TopoDB } from '../../DB/TopoDB';

const EditPage = ({route, navigator, imgBlob, updateTopos}:
  {route: any, navigator: Navigator, imgBlob:Blob, updateTopos: () => void}) => {

  const [imgUrl, setImgUrl] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [setter, setSetter] = useState<string>();
  const [grade, setGrade] = useState<number>();

  const saveTopo = () => {
    console.log(title);

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
        data: res,
        createdAt: (new Date().getTime()) / 1000
      });
      await ons.notification.toast('トポを保存しました。', {timeout: 2000});
      navigator.popPage();
      updateTopos();
    }
    fr.onerror = eve => {
      alert('保存に失敗しました。');
    }
    fr.readAsArrayBuffer(imgBlob);
  }

  const loadImage = () => {
    const fr = new FileReader() ;
    fr.onload = ev => {
      setImgUrl(fr.result?.toString());
    }
    fr.readAsDataURL(imgBlob);
  }

  useEffect(loadImage);

  const onCloseTapped = () => navigator.popPage();

  const onTitleChanged= (e: ChangeEvent<any>) => setTitle(e.target.value);
  const onSetterChanged= (e: ChangeEvent<any>) => setSetter(e.target.value);
  const onGradeChanged= (e: ChangeEvent<any>) => setGrade(e.target.value);

  return (
    <Page className={'edit-page'}>
      <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
      <div id={'edit-container'}>
        <h3 className={'page-title'}><i className={'fas fa-pen'}/>課題作成</h3>
        <form id={'edit-form'}>
          <img className={'edit-image'} src={imgUrl}/>
          <p className={'edit-title'}>課題名</p>
          <Input className='edit-input' onChange={onTitleChanged}/>
          <p className={'edit-title'}>設定者</p>
          <Input className='edit-input' onChange={onSetterChanged}/>
          <p className={'edit-title'}>グレード</p>
          <Select modifier={'material'} onChange={onGradeChanged}>
            <option value="1">7級</option>
            <option value="2">6級</option>
            <option value="3">5級</option>
            <option value="4">4級</option>
            <option value="5">3級</option>
            <option value="6">2級</option>
            <option value="7">1級</option>
            <option value="8">初段</option>
            <option value="9">二段</option>
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