import ons from 'onsenui'

const toDomain = import.meta.env.VITE_WEBTOPO_URL;
export const postToWebtopo = (imageDataUrl: string, closeWindow: boolean) => {
  try {
    window.opener.postMessage({image: imageDataUrl, closeWindow}, toDomain);

    ons.notification.confirm({
      title: 'Webトポ連携',
      message: 'Webトポに画像を連携しました。\nWebトポから編集を続けてください。',
      buttonLabels: ['OK'],
    });
  } catch(e) {
    console.log(e)
    alert('連携に失敗しました。'); 
  }
}