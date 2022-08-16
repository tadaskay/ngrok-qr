#!/usr/bin/env node

"use strict";

import ngrok from "ngrok"
import qrcode from "qrcode-terminal"
import chalk from "chalk"
import cliArgs from "command-line-args"

async function main() {
  const { argv } = process;
  const args = argv.slice(2);

  const options = cliArgs([
    { name: "port", type: Number},
    { name: "authtoken", type: String}
  ])

  console.log('options', JSON.stringify(options))

  const url = await ngrok.connect(options);

  const code = await new Promise(resolve =>
    qrcode.generate(url, { small: true }, qr => resolve(qr))
  );

  const output = [
    `---------------------------`,
    `> ngrok http ${JSON.stringify(options)}`,
    `---------------------------`,
    chalk.underline.cyan(url),
    `---------------------------`,
    code
  ].join("\r\n");

  console.log(output);
}

main()
  .then(() => {})
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
