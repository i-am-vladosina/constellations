export function range(start: number, end: number, step: number = 1) {
  let array: number[] = [];

  for (let i = start; i < end; i += step) {
    array.push(i);
  }

  return array;
}

export function inRange(n: number, start: number, end: number = Infinity) {
  return n > start && n < end;
}

export function random(min: number, max: number, float: boolean = false) {
  return float ? randomFloat(min, max) : randomInt(min, max);
}

export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number) {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
}

export function keyBy<T>(collection: T[], iteratee: keyof T): { [index: string]: T } {
  const key = iteratee as string;
  return collection.reduce((obj, value) => {
    obj[value[key]] = value;
    return obj;
  }, {});
}
