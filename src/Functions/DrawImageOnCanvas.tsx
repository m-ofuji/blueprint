import { MAX_SIDE_LENGTH } from "../Constants/MaxSideLength";
import { MAIN_COLOR } from "../Constants/Colors";
import { resizeCanvas } from "./ResizeCanvas";
import { ITopo } from "../DB/TopoDB";
import { GRADES } from "../Constants/Grades";

export const drawTopoImageOnCanvas = async (topoData: ITopo, resize: boolean, printInfo: boolean): Promise<HTMLCanvasElement> => {
  const b = new Blob([topoData?.data[0]]);
  const bitmap = await createImageBitmap(b);
  const canvas = document.createElement('canvas');

  const imgWidth = bitmap.width;
  const imgHeight = bitmap.height;
  const fixPixelRatio = imgWidth > MAX_SIDE_LENGTH || imgHeight > MAX_SIDE_LENGTH;
  const pixelRatio = resize && fixPixelRatio ? MAX_SIDE_LENGTH / Math.max(imgWidth, imgHeight) : 1;

  canvas.width = imgWidth;
  canvas.height = imgHeight;

  const ctx = canvas.getContext('2d');
  // トポ画像描画
  ctx?.drawImage(bitmap, 0, 0);

  const resizedCanvas = resizeCanvas(canvas, pixelRatio);

  if (!printInfo) {
    return resizedCanvas;
  } else {
    const infoCanvas = document.createElement('canvas');

    const fontSize = resizedCanvas.height * 0.05;
    const padding = fontSize / 4;

    const infoWidth = resizedCanvas.width;
    const infoHeight = resizedCanvas.height + (fontSize * 2) + (padding * 3);

    infoCanvas.width = infoWidth;
    infoCanvas.height = infoHeight;

    const infoCtx = infoCanvas.getContext('2d');
    if (infoCtx !== null) {
      // 背景色設定
      infoCtx.fillStyle = MAIN_COLOR;
      infoCtx.fillRect(0, 0, infoCanvas.width, infoCanvas.height);

      // トポ情報描画
      infoCtx.font = fontSize.toString() + 'px sans-serif';
      infoCtx.fillStyle = '#fafafa';
      infoCtx.textBaseline = 'top';
      infoCtx.textAlign = 'left';
      const resizedHeigt = resizedCanvas.height;
      infoCtx.fillText(topoData.name, padding, resizedHeigt + padding);
      infoCtx.fillText(new Date(topoData.createdAt * 1000).toLocaleDateString(), padding, resizedHeigt + fontSize + (padding * 2));
      infoCtx.fillText(GRADES.find(x => x.id === topoData.grade)?.name ?? '', infoWidth - fontSize * 2 - padding, resizedHeigt + (fontSize / 2) + (padding * 2));

      // トポ画像コピー
      const copied = resizedCanvas.getContext('2d')?.getImageData(0, 0, resizedCanvas.width, resizedCanvas.height);
      if (copied) {
        infoCtx.putImageData(copied, 0, 0);
      }
    }
    return infoCanvas;
  }
};