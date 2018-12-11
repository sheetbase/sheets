# Sheetbase Module: @sheetbase/sheets-server

Using Google Sheets as a database.

<!-- <block:header> -->

[![Build Status](https://travis-ci.com/sheetbase/sheets-server.svg?branch=master)](https://travis-ci.com/sheetbase/sheets-server) [![Coverage Status](https://coveralls.io/repos/github/sheetbase/sheets-server/badge.svg?branch=master)](https://coveralls.io/github/sheetbase/sheets-server?branch=master) [![NPM](https://img.shields.io/npm/v/@sheetbase/sheets-server.svg)](https://www.npmjs.com/package/@sheetbase/sheets-server) [![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

Using npm: `npm install --save @sheetbase/sheets-server`

```ts
import * as Sheets from "@sheetbase/sheets-server";
```

As a library: `1pbQpXAA98ruKtYTtKwBDtdgGTL_Nc_ayGzdRR2ULosG6GcKQJUF5Qyjy`

Set the _Indentifier_ to **SheetsModule** and select the lastest version, [view code](https://script.google.com/d/1pbQpXAA98ruKtYTtKwBDtdgGTL_Nc_ayGzdRR2ULosG6GcKQJUF5Qyjy/edit?usp=sharing).

```ts
declare const SheetsModule: { Sheets: any };
const Sheets = SheetsModule.Sheets;
```

## Scopes

`https://www.googleapis.com/auth/spreadsheets`

## Usage

- Docs homepage: https://sheetbase.github.io/sheets-server

- API reference: https://sheetbase.github.io/sheets-server/api

### Examples

```ts
import * as Sheets from "./public_api";

function load_() {
  const databaseId = "1Zz5kvlTn2cXd41ZQZlFeCjvVR_XhpUnzKlDGB8QsXoI";
  return Sheets.sheets({
    databaseId,
    keyFields: { foo: "slug" }
  });
}

export function example1(): void {
  const { SQL } = load_();

  // get all items from 'foo' table
  const all = SQL.all("foo");
  Logger.log(all);
}

export function example2(): void {
  const { SQL } = load_();

  // get item eith the # of 3 from 'foo' table
  const item = SQL.item("foo", 3);
  Logger.log(item);
}

export function example3(): void {
  const { SQL } = load_();

  // update item with # of 6
  SQL.update("foo", { content: new Date().getTime() }, 6);
  Logger.log("foo-6 updated using SQL.");
}

export function example4(): void {
  const { SQL } = load_();

  // create foo-8
  SQL.update("foo", {
    slug: "foo-8",
    title: "Foo 8",
    content: new Date().getTime()
  });
  Logger.log("foo-8 added using SQL.");
}

export function example5(): void {
  const { NoSQL } = load_();

  // get all item of 'foo' collection
  const collection = NoSQL.collection("foo");
  // get content of foo-2 as a list
  const list = NoSQL.list("/foo/foo-2/content");
  Logger.log(collection);
  Logger.log(list);
}

export function example6(): void {
  const { NoSQL } = load_();

  // get item foo-3
  const doc = NoSQL.doc("foo", "foo-3");
  const object = NoSQL.object("/foo/foo-3");
  Logger.log(doc);
  Logger.log(object);
}

export function example7(): void {
  const { NoSQL } = load_();

  // update foo-6
  NoSQL.update({
    "/foo/foo-6/content": new Date().getTime()
  });
  Logger.log("foo-6 updated using NoSQL.");
}

export function example8(): void {
  const { NoSQL } = load_();

  // create foo-8
  NoSQL.update({
    "/foo": { slug: "foo-8", title: "Foo 8", content: new Date().getTime() }
  });
  Logger.log("foo-8 added using NoSQL.");
}

export function example9(): void {
  const { SQL } = load_();

  const search = SQL.search("foo", "me", { fields: ["content"] });
  Logger.log(search);
}
```

## License

**@sheetbase/sheets-server** is released under the [MIT](https://github.com/sheetbase/sheets-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/sheets-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://lamnhan.github.io/assets/images/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://lamnhan.github.io/assets/images/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
