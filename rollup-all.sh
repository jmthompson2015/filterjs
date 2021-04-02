#! /bin/bash

export BASE=/Volumes/StorageDrive/jmthompson/git/filterjs
export BIN=${BASE}/node_modules/rollup/dist/bin

${BIN}/rollup -c rollup.config.state.js
${BIN}/rollup -c
${BIN}/rollup -c rollup.config.terser.js
