export const countStrLength = (str: string) => {
    if (!str || str.length <= 0) {
        return 0;
    } else {
        return str.split('').map(x => (x.match(/[ -~]/) ? 0.5 : 1) as number).reduce((a, b) => {return a + b;}) ;
    }
};