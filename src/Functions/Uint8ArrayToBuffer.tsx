export const uint8ArrayToBuffer = (array: Uint8Array) => {
  return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)
}