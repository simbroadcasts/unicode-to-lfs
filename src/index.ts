import { unicodeToLfs } from "./unicodeToLfs";
import { cpTables } from "./codepageTables";
import * as fs from "node:fs";

function convert() {
  Object.entries(cpTables.E);

  fs.writeFileSync(
    "test.json",
    JSON.stringify(
      Object.entries(cpTables.E).map(([key, value]) => [
        parseInt(key, 10),
        value,
      ]),
      undefined,
      2,
    ),
  );

  console.log("done");
}

convert();

export = unicodeToLfs;
