import { downloadURI } from "./DownloadUri";

export const downloadBlob = (data: Blob, fileName: string) => {
  var url = URL.createObjectURL(data);
  downloadURI(url, fileName);
}