import { downloadURI } from "./DownloadUri";
import { getCurrentTimestamp } from "./CurrentTimestamp";

export const downloadBlob = (data: Blob, fileName: string) => {
  var url = URL.createObjectURL(data);
  downloadURI(url, fileName);
}