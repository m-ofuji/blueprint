export const loadLoalFile = (onSelected: (file: FileList) => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = () => {
    if (!input.files) throw new Error("failed to load file");
    onSelected(input.files);
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}