export const addNewLine = (str: string, oneLineLimit: number) => {
  console.log('limit', oneLineLimit);
  return str.split('').map((x,i) => i !== 0 && i % (oneLineLimit - 1) === 0 ? x + '\n' : x).join('');
};