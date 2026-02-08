const toDomain = import.meta.env.VITE_WEBTOPO_URL;
export const postToWebtopo = (imageDataUrl: string, closeWindow: boolean) => {
  console.log(toDomain);
  try {
    window.opener.postMessage({image: imageDataUrl, closeWindow}, toDomain);
  } catch(e) {
    console.log(e)
    alert('連携に失敗しました。'); 
  }
}