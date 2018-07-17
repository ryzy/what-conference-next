export function randomRange(min = 0, max = 10): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
