"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myLog = exports.Makecurl = exports.Parsecurl = void 0;
var myLog = function (name) {
    var message = "Your beautiful name is ".concat(name);
    console.log({ message: message });
    return { message: "Your beautiful name is ".concat(name) };
};
exports.myLog = myLog;
function Parsecurl(curlData) {
    var _a, _b;
    var obj = {
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
    var methodPattern = /--request\s+(\S+)/;
    var methodMatch = curlData.match(methodPattern);
    var methodMatch1 = curlData.match(/-X '([^']+)'/);
    var methodMatch2 = curlData.match(/-X\s+([A-Z]+)/);
    if (methodMatch !== null && methodMatch[1]) {
        obj.requestType = methodMatch[1];
    }
    else if (methodMatch1 !== null && methodMatch1[1]) {
        obj.requestType = methodMatch1[1];
    }
    else if (methodMatch2 !== null && methodMatch2[1]) {
        obj.requestType = methodMatch2[1];
    }
    var validRequestTypeArr = [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
    ];
    if (obj.requestType !== "") {
        if (!validRequestTypeArr.includes(obj.requestType.toUpperCase())) {
            obj.errorIfOccured.message = "Error while importing Curl: The method ".concat(obj.requestType, " is not supported.");
            return obj;
        }
    }
    // Extract URL
    var urlRegex1 = /curl\s+--location\s+--request\s+\S+\s+'([^']+)'/;
    var urlMatch1 = curlData.match(urlRegex1);
    if (urlMatch1 && urlMatch1[1]) {
        obj.url = urlMatch1[1].split("?")[0];
    }
    var urlRegex = /curl(?:\s+--location)?\s+'([^']+)'/;
    var urlMatch = curlData.match(urlRegex);
    if (urlMatch) {
        obj.url = urlMatch[1].split("?")[0];
    }
    if (obj.url === "") {
        var urlMatch2 = (_a = curlData.match(/https:\/\/\S+/)) !== null && _a !== void 0 ? _a : "";
        obj.url = (_b = urlMatch2[0]) === null || _b === void 0 ? void 0 : _b.split("?")[0];
    }
    if (!obj.url || obj.url === "") {
        var urlRegex3 = /curl\s+--location\s+-g\s+--request\s+\w+\s+'([^']+?)'/;
        var match_1 = curlData.match(urlRegex3);
        obj.url = match_1 && match_1[1];
    }
    // Extract query parameters
    var queryParamsRegex = /https?:\/\/[^\s]+/;
    var match = curlData.match(queryParamsRegex);
    if (match) {
        if (match[0].indexOf("?") !== -1) {
            var queryParamsA = match[0].split("?")[1].split("&");
            queryParamsA.forEach(function (param) {
                var _a = param.split("="), key = _a[0], value = _a[1];
                obj.queryParams[key] = value === null || value === void 0 ? void 0 : value.replaceAll("'", "");
            });
        }
        else {
            obj.queryParams = { "": "" };
        }
    }
    else {
        obj.queryParams = { "": "" };
    }
    //Extract Headers
    var headersRegex1 = /-header '([^:]+): ([^']*)'/g;
    var headersRegex2 = /-H '([^:]+): ([^']*)'/g;
    var headersRegex3 = /-H "([^:]+): ([^"]*)"/g;
    var headersMatch;
    while ((headersMatch = headersRegex1.exec(curlData)) !== null) {
        var key = headersMatch[1];
        var value = headersMatch[2] || "";
        obj.headers[key] = value;
    }
    while ((headersMatch = headersRegex2.exec(curlData)) !== null) {
        var key = headersMatch[1];
        var value = headersMatch[2] || "";
        obj.headers[key] = value;
    }
    while ((headersMatch = headersRegex3.exec(curlData)) !== null) {
        var key = headersMatch[1];
        var value = headersMatch[2] || "";
        obj.headers[key] = value;
    }
    // Extract body
    var bodyRegex = /--data(-raw)? '([^]+)'/;
    var bodyRegex1 = /--data-raw \$'([^]+)'/;
    var bodyMatch = curlData.match(bodyRegex);
    var bodyMatch1 = curlData.match(bodyRegex1);
    if (bodyMatch) {
        obj.body = bodyMatch[2].replace(/\\'/g, "'");
        if (obj.requestType === "") {
            obj.requestType = "Post";
        }
    }
    else {
        if (bodyMatch1) {
            obj.body = bodyMatch1[1].replace(/\\'/g, "'");
            if (obj.requestType === "") {
                obj.requestType = "Post";
            }
        }
    }
    if (obj.body === "") {
        var bodyMatch2 = curlData.match(/-d '([^']+)'/);
        if (bodyMatch2) {
            obj.body = bodyMatch2[1];
        }
    }
    if (obj.body === "") {
        var bodyMatch3 = curlData.match(/--data-urlencode '([^']+)'/g);
        if (bodyMatch3) {
            var formattedResponse_1 = {};
            bodyMatch3.forEach(function (item) {
                var parts = item.split("=");
                var key = parts[0].split("'")[1];
                var value = parts[1].split("'")[0];
                formattedResponse_1[key] = value;
            });
            obj.body = JSON.stringify(formattedResponse_1);
            obj.requestType = "Post";
        }
    }
    if (obj.requestType === "") {
        obj.requestType = "Get";
    }
    return obj;
}
exports.Parsecurl = Parsecurl;
function Makecurl(data) {
    var _a, _b;
    var requestType = (_b = (_a = data === null || data === void 0 ? void 0 : data.requestType) === null || _a === void 0 ? void 0 : _a.toString().toUpperCase()) !== null && _b !== void 0 ? _b : "GET";
    var curlCommand = "curl --location --request ".concat(requestType, " '").concat(data.url, "'");
    // Add headers
    data === null || data === void 0 ? void 0 : data.headers.forEach(function (header) {
        if (header === null || header === void 0 ? void 0 : header.isChecked) {
            curlCommand += " \\\n      --header '".concat(header === null || header === void 0 ? void 0 : header.key, ": ").concat(header === null || header === void 0 ? void 0 : header.value, "'");
        }
    });
    // Add body if present
    if (data === null || data === void 0 ? void 0 : data.body) {
        curlCommand += " \\\n    --data-raw '".concat(JSON.stringify(data === null || data === void 0 ? void 0 : data.body, null, 4), "'");
    }
    return curlCommand;
}
exports.Makecurl = Makecurl;
// Mapping of function names to functions
var functions = {
    myLog: myLog,
    Parsecurl: Parsecurl,
    Makecurl: Makecurl,
};
// Get the function name and arguments from command-line arguments
var _a = process.argv, functionName = _a[2], args = _a.slice(3);
if (functionName && functions[functionName]) {
    functions[functionName].apply(functions, args);
}
