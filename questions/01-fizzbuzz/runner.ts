import yargs from "yargs";
import { fizzBuzz } from "./fizzbuzz";

async function run() {
  const argv = await yargs
    .options({
      start: { demand: "start option", alias: "s", type: "number" },
      end: { demand: "end option", alias: "e", type: "number" },
    })
    .strict().argv;

  fizzBuzz(argv.start, argv.end, console.log);
}

run();
