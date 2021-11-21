import { downloadURI } from './DownloadUri';

export const downloadCanvas = (canvas: HTMLCanvasElement, name: string, scale: number = 1 ) => {
  const tmp = document.createElement("canvas");
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  const tctx = tmp.getContext('2d');
  tctx?.drawImage(canvas, 0, 0);

  // 何回に分けてリサイズするか
  const resizeCount = 10;

  const diffWidth = (canvas.width - (canvas.width * scale)) / resizeCount;
  const diffHeight = (canvas.height - (canvas.height * scale)) / resizeCount;

  for (let i = 0; i < resizeCount; i++) {
    tmp.width = canvas.width - diffWidth * (i + 1);
    tmp.height = canvas.height - diffHeight * (i + 1);
    tctx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tmp.width, tmp.height);
  }

  downloadURI(tmp.toDataURL('image/png'), name + '.png');
}