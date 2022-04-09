export interface HoldProps {
  id:number
  x: number,
  y: number,
  color: string,
  scale: number | undefined,
  onDoubleTapped?: ((id: number) => void)
}

export const isHoldProps = (arg: unknown): arg is HoldProps =>
    typeof arg === "object" &&
    arg !== null &&
    typeof (arg as HoldProps).id === 'number' &&
    typeof (arg as HoldProps).x === 'number' &&
    typeof (arg as HoldProps).y === 'number' &&
    (typeof (arg as HoldProps).scale === 'number' || (arg as HoldProps).scale === undefined);