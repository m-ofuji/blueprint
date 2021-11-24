export const openFileSelecter = (onSelected: (file: string | ArrayBuffer | null) => void) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = () => {
    if (!input.files) return;
    const reader = new FileReader();
    reader.onload = () => {
      onSelected(reader.result);
    };
    reader.readAsText(input.files[0]);
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}