import { blobToUrl } from "./BlobToUrl";
export const arrayBufferToUrl = (buf: ArrayBuffer) => blobToUrl(new Blob([buf], {type: 'image/png'}));