import { buyCandyBars } from "./candybar";
describe("candybar tests", () => {
  test("buy candy - 0 dollars - 0 bars", () => {
    expect(buyCandyBars(0)).toEqual(0);
  });
  test("buy candy - 2 dollars - 2 bar", () => {
    expect(buyCandyBars(2)).toEqual(2);
  });
  test("buy candy - 3 dollars - 4 bar", () => {
    expect(buyCandyBars(3)).toEqual(4);
  });
  test("buy candy - 6 dollars - 8 bar", () => {
    expect(buyCandyBars(6)).toEqual(8);
  });
  test("buy candy - 15 dollars - 22 bar", () => {
    expect(buyCandyBars(15)).toEqual(22);
  });
});
