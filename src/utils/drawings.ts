export function drawTick(ctx: CanvasRenderingContext2D, cb: VoidFunction) {
  ctx.beginPath();
  cb();
  ctx.fill();
  ctx.stroke();
}

export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
