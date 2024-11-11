const myLog = (name: string) => {
  const message = `Your beautiful name is ${name}`;
  console.log({ message });
  return { message: `Your beautiful name is ${name}` };
};

function Parsecurl(curlData: any) {
  const obj: any = {
    url: "",
    queryParams: {},
    headers: {},
    body: "",
    requestType: "",
    errorIfOccured: {
      message: "",
    },
  };

  // Extract requestType
  const methodPattern = /--request\s+(\S+)/;
  const methodMatch = curlData.match(methodPattern);
  const methodMatch1 = curlData.match(/-X '([^']+)'/);
  const methodMatch2 = curlData.match(/-X\s+([A-Z]+)/);

  if (methodMatch !== null && methodMatch[1]) {
    obj.requestType = methodMatch[1];
  } else if (methodMatch1 !== null && methodMatch1[1]) {
    obj.requestType = methodMatch1[1];
  } else if (methodMatch2 !== null && methodMatch2[1]) {
    obj.requestType = methodMatch2[1];
  }

  let validRequestTypeArr = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS",
  ];
  if (obj.requestType !== "") {
    if (!validRequestTypeArr.includes(obj.requestType.toUpperCase())) {
      obj.errorIfOccured.message = `Error while importing Curl: The method ${obj.requestType} is not supported.`;
      return obj;
    }
  }

  // Extract URL
  const urlRegex1 = /curl\s+--location\s+--request\s+\S+\s+'([^']+)'/;
  const urlMatch1 = curlData.match(urlRegex1);
  if (urlMatch1 && urlMatch1[1]) {
    obj.url = urlMatch1[1].split("?")[0];
  }
  const urlRegex = /curl(?:\s+--location)?\s+'([^']+)'/;
  const urlMatch = curlData.match(urlRegex);
  if (urlMatch) {
    obj.url = urlMatch[1].split("?")[0];
  }
  if (obj.url === "") {
    const urlMatch2 = curlData.match(/https:\/\/\S+/) ?? "";
    obj.url = urlMatch2[0]?.split("?")[0];
  }
  if (!obj.url || obj.url === "") {
    const urlRegex3 = /curl\s+--location\s+-g\s+--request\s+\w+\s+'([^']+?)'/;
    const match = curlData.match(urlRegex3);
    obj.url = match && match[1];
  }

  // Extract query parameters
  const queryParamsRegex = /https?:\/\/[^\s]+/;
  const match = curlData.match(queryParamsRegex);
  if (match) {
    if (match[0].indexOf("?") !== -1) {
      const queryParamsA = match[0].split("?")[1].split("&");
      queryParamsA.forEach((param: any) => {
        const [key, value] = param.split("=");
        obj.queryParams[key] = value?.replaceAll("'", "");
      });
    } else {
      obj.queryParams = { "": "" };
    }
  } else {
    obj.queryParams = { "": "" };
  }

  //Extract Headers
  const headersRegex1 = /-header '([^:]+): ([^']*)'/g;
  const headersRegex2 = /-H '([^:]+): ([^']*)'/g;
  const headersRegex3 = /-H "([^:]+): ([^"]*)"/g;

  let headersMatch;
  while ((headersMatch = headersRegex1.exec(curlData)) !== null) {
    const key = headersMatch[1];
    const value = headersMatch[2] || "";
    obj.headers[key] = value;
  }
  while ((headersMatch = headersRegex2.exec(curlData)) !== null) {
    const key = headersMatch[1];
    const value = headersMatch[2] || "";
    obj.headers[key] = value;
  }
  while ((headersMatch = headersRegex3.exec(curlData)) !== null) {
    const key = headersMatch[1];
    const value = headersMatch[2] || "";
    obj.headers[key] = value;
  }

  // Extract body
  const bodyRegex = /--data(-raw)? '([^]+)'/;
  const bodyRegex1 = /--data-raw \$'([^]+)'/;
  const bodyMatch = curlData.match(bodyRegex);
  const bodyMatch1 = curlData.match(bodyRegex1);
  if (bodyMatch) {
    obj.body = bodyMatch[2].replace(/\\'/g, "'");
    if (obj.requestType === "") {
      obj.requestType = "Post";
    }
  } else {
    if (bodyMatch1) {
      obj.body = bodyMatch1[1].replace(/\\'/g, "'");
      if (obj.requestType === "") {
        obj.requestType = "Post";
      }
    }
  }
  if (obj.body === "") {
    const bodyMatch2 = curlData.match(/-d '([^']+)'/);
    if (bodyMatch2) {
      obj.body = bodyMatch2[1];
    }
  }
  if (obj.body === "") {
    const bodyMatch3 = curlData.match(/--data-urlencode '([^']+)'/g);
    if (bodyMatch3) {
      let formattedResponse: any = {};
      bodyMatch3.forEach((item: any) => {
        const parts = item.split("=");
        const key = parts[0].split("'")[1];
        const value = parts[1].split("'")[0];
        formattedResponse[key] = value;
      });

      obj.body = JSON.stringify(formattedResponse);
      obj.requestType = "Post";
    }
  }

  if (obj.requestType === "") {
    obj.requestType = "Get";
  }
  return obj;
}

function Makecurl(data: any) {
  let requestType = data?.requestType?.toString().toUpperCase() ?? "GET";
  let curlCommand = `curl --location --request ${requestType} '${data.url}'`;

  // Add headers
  data?.headers.forEach((header: any) => {
    if (header?.isChecked) {
      curlCommand += ` \\
      --header '${header?.key}: ${header?.value}'`;
    }
  });

  // Add body if present
  if (data?.body) {
    curlCommand += ` \\
    --data-raw '${JSON.stringify(data?.body, null, 4)}'`;
  }

  return curlCommand;
}

// Mapping of function names to functions
const functions: { [key: string]: (...args: any[]) => void } = {
  myLog,
  Parsecurl,
  Makecurl,
};

// Get the function name and arguments from command-line arguments
const [, , functionName, ...args] = process.argv;

if (functionName && functions[functionName]) {
  functions[functionName](...args);
}

export { Parsecurl, Makecurl, myLog };
