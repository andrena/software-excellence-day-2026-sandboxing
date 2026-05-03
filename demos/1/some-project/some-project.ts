import readline from "node:readline/promises"
import process from "node:process"
import isEven from "is-even"

if (import.meta.main) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  let input
  while ((input = await rl.question("Input a number: "))) {
    console.log(getEvenOddResult(Number.parseInt(input)))
  }
  rl.close()
}

export function getEvenOddResult(n: number) {
  return `${n} is ${isEven(n) ? "even" : "odd"}`
}
