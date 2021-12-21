import ons from 'onsenui';
import { Navigator } from 'react-onsenui';
import { ChangeEvent, useState } from 'react';
import { Page, Input, Select } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';
import { TopoDB } from '../../DB/TopoDB';
import { GRADES } from '../../Constants/Grades';
import { arrayBufferToUrl } from '../../Functions/ArraybufferToUrl';

export interface HelpPageProps {
  route: any,
  navigator: Navigator,
  id?: number;
}

const EditPage = (props: HelpPageProps) => {

  const onCloseTapped = () => props.navigator.popPage();

  return (
    <Page className={'edit-page'}>
      <div className={'page-content edit-page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <div id={'edit-container'}>
          <h3 className={'page-title'}><i className={'fas fa-pen'}/>使い方</h3>
          {/* <form id={'edit-form'}>
            {
              props.data?.map((x, idx) => {
                const imgUrl = arrayBufferToUrl(x);
                return <img key={idx} className={'edit-image'} src={imgUrl} alt={'画像の読み込みに失敗しました'} onClick={openImage(imgUrl)}/>;
              })
            }
            <p className={'edit-title'}>課題名</p>
            <Input className='edit-input' modifier="underbar" value={title} onChange={onTitleChanged}/>
            <p className={'edit-title'}>設定者</p>
            <Input className='edit-input' modifier="underbar" value={setter} onChange={onSetterChanged}/>
            <p className={'edit-title'}>グレード</p>
            <Select modifier={'material'} value={grade.toString()} onChange={onGradeChanged}>
              {GRADES.filter(x => x.id <= 10).map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </Select>
          </form> */}
        </div>
        {/* <button className={'edit-button'} onClick={saveTopo}>
          <i className={'fas fa-save'}/>保存
        </button> */}
      </div>
    </Page>
  )
}

export default EditPage;