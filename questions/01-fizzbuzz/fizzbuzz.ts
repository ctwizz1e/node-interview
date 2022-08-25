/**
 * This function should implement the standard FizzBuzz logic.
 *
 * Print integers "start" (inclusive) to "end" (exclusive), but print "Fizz" if the
 * integer is divisible by 3, "Buzz" if an integer is divisible by 5, and "FizzBuzz"
 * if an integer is divisible by both 3 and 5
 *
 * If an invalid input is provided, throw an InputError
 *
 * @param start number to start printing fizzbuzz logic from - inclusive
 * @param end number to stop printing fizzbuzz logic from - exclusive
 * @param printFunction function to pass statements to print
 */
export function fizzBuzz(
  start: number,
  end: number,
  printFunction: (msg: string) => void
): void {
  // sanity check inputs
  if (
    start === undefined ||
    start === null ||
    end === undefined ||
    end === null
  ) {
    throw new InputError(`must provide valud start/end values`, start, end);
  }

  if (start > end) {
    throw new InputError(`cannot start on or after end`, start, end);
  }

  if (start < 0 || end < 0) {
    throw new InputError(`cannot start or end before 0`, start, end);
  }

  let i = start;
  while (true) {
    const divisibleByThree = i % 3 === 0;
    const divisibleByFive = i % 5 === 0;
    const msg =
      divisibleByFive && divisibleByThree
        ? "FizzBuzz"
        : divisibleByThree
        ? "Fizz"
        : divisibleByFive
        ? "Buzz"
        : `${i}`;

    printFunction(msg);
    i++;
    if (i >= end) {
      return;
    }
  }
}

export class InputError extends Error {
  constructor(msg: string, ...params: any[]) {
    console.log(msg, params);
    super(msg);
    Object.setPrototypeOf(this, InputError.prototype);
  }
}
