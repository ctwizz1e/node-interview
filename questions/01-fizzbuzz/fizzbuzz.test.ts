import { fizzBuzz, InputError } from "./fizzbuzz";

describe("fizzBuzz tests", () => {
  let print = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
    // print = jest.fn(console.log);
    print = jest.fn();
  });

  test("start greater than end - throws InputError", () => {
    expect(() => fizzBuzz(10, 9, print)).toThrow(InputError);
  });

  test("standard use case 1 - 20", () => {
    fizzBuzz(1, 20, print);

    expect(print).toBeCalledTimes(19);
    expect(print).toHaveBeenNthCalledWith(1, "1");
    expect(print).toHaveBeenNthCalledWith(2, "2");
    expect(print).toHaveBeenNthCalledWith(3, "Fizz");
    expect(print).toHaveBeenNthCalledWith(4, "4");
    expect(print).toHaveBeenNthCalledWith(5, "Buzz");
    expect(print).toHaveBeenNthCalledWith(6, "Fizz");
    expect(print).toHaveBeenNthCalledWith(7, "7");
    expect(print).toHaveBeenNthCalledWith(8, "8");
    expect(print).toHaveBeenNthCalledWith(9, "Fizz");
    expect(print).toHaveBeenNthCalledWith(10, "Buzz");
    expect(print).toHaveBeenNthCalledWith(11, "11");
    expect(print).toHaveBeenNthCalledWith(12, "Fizz");
    expect(print).toHaveBeenNthCalledWith(13, "13");
    expect(print).toHaveBeenNthCalledWith(14, "14");
    expect(print).toHaveBeenNthCalledWith(15, "FizzBuzz");
    expect(print).toHaveBeenNthCalledWith(16, "16");
    expect(print).toHaveBeenNthCalledWith(17, "17");
    expect(print).toHaveBeenNthCalledWith(18, "Fizz");
    expect(print).toHaveBeenNthCalledWith(19, "19");
  });

  test("start equal to end - prints one line", () => {
    fizzBuzz(9, 9, print);
    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenNthCalledWith(1, "Fizz");
  });
});
