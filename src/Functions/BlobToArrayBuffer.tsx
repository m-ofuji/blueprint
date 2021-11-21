export const BlobToArrayBuffer = (
    blob: Blob, 
    onSuccess?: (res: string | ArrayBuffer | null, eve: ProgressEvent<FileReader>) => void,
    onFailed?: (res: string | ArrayBuffer | null, ev: ProgressEvent<FileReader>) => void,
  ) => {
  const fr = new FileReader();
  fr.onload = eve => {if (onSuccess) {onSuccess(fr.result, eve)}};
  fr.onerror = eve => {if (onFailed) {onFailed(fr.result, eve)}};
  fr.readAsArrayBuffer(blob);
};