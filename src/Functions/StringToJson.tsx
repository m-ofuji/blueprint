export const stringToJson = (data:string) => {
  try {
    return JSON.parse(data);
  } catch (ex) {
    return false;
  }
}