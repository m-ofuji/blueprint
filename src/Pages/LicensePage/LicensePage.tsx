import ons from 'onsenui';
import { Navigator } from 'react-onsenui';
import { ChangeEvent, useState } from 'react';
import { Page } from 'react-onsenui';
import { CloseButton } from '../../Components/CloseButton';

const LicensePage = (route: any, navigator: Navigator,) => {

  const onCloseTapped = () => navigator.popPage();

  return (
    <Page className={'License-page'}>
      <div className={'page-content edit-page-content'}>
        <CloseButton className={'close-button float-right-top'} onTapped={onCloseTapped}></CloseButton>
        <div id={'edit-container'}>
          <h3 className={'page-title'}><i className={'fas fa-pen'}/>課題作成</h3>
        </div>
      </div>
    </Page>
  )
}

export default LicensePage;