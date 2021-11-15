import { downloadURI } from "./DownloadUri";
import { getCurrentTimestamp } from "./CurrentTimestamp";

export const downloadBlob = (data: Blob) => {
  var url = URL.createObjectURL(data);
  downloadURI(url, `topos_${getCurrentTimestamp()}.json`);
}