import test from "node:test"
import assert from "node:assert/strict"
import { getEvenOddResult } from "./some-project.ts"

test("produces correct results", () => {
  assert.equal(getEvenOddResult(1), "1 is odd")
  assert.equal(getEvenOddResult(2), "2 is even")
  assert.equal(getEvenOddResult(123), "123 is odd")
})
