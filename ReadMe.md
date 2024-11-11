# curl-extract-build

**Version 1**

## Curl Extractor

curl-extract-build is a powerful and versatile NPM package designed to streamline the process of creating and extracting data from cURL commands. Whether you're building APIs or automating requests, this package provides essential utilities to simplify and optimize your workflow.

## Installation

To install the package, use the following command:

```bash
npm install curl-extract-build
```

## Getting Started

Here's how you can use the functions provided by `curl-extract-build`:

### 1. `myLog`

```javascript
const { myLog } = require('curl-extract-build');
myLog('Alice');
```

**Description**: This function is used to test if the package is working correctly. It simply logs your name to the console.

### 2. `Parsecurl`

```javascript
const { Parsecurl } = require('curl-extract-build');
let curl = Your Curl data;
console.log(Parsecurl(curl));
```

**Description**: The `Parsecurl` function extracts and processes data from the provided cURL command. It parses the cURL string and returns the extracted data in a structured format.

### 3. `Makecurl`

```javascript
const { Makecurl } = require('curl-extract-build');
const myCurl = {
  requestType: 'POST',
  url: 'your url', // URL + Query param
  headers: [
    { key: 'Content-Type', value: 'application/json', isChecked: true },
    // ... other headers with same key
  ],
  body: {
    // Your body data
  },
};
console.log(Makecurl(myCurl));
```

**Description**: The `Makecurl` function generates a cURL command from the provided data object. This is useful for constructing cURL commands programmatically based on your configuration.

## Keywords

* curl
* make
* extract
* extract-curl
* make-curl
* postman
* api
* build
