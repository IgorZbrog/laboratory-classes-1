const homeRouting = require("./home");
const productRouting = require("./product");
const logoutRouting = require("./logout");
const STATUS_CODE = require("../constants/statusCode");

function requestRouting(request, response) {
    const { url, method } = request;
    const date = new Date().toISOString();

    console.log(`INFO [${date}]: ${method} - ${url}`);

    if (url === "/") {
        homeRouting(method, response);
    } else if (url.startsWith("/product")) {
        productRouting(request, response);
    } else if (url === "/logout") {
        logoutRouting(method, response);
    } else if (url === "/kill") {
        console.log(`PROCESS [${date}]: logout has been initiated and the application will be closed.`);
        process.exit();
    } else {
        console.error(`ERROR [${date}]: requested url [${url}] doesnt exist.`);
        response.statusCode = STATUS_CODE.NOT_FOUND;
        response.setHeader("Content-Type", "text/html");
        response.write(`<html><body><h1>404 Not Found</h1></body></html>`);
        response.end();
    }
}

module.exports = requestRouting;
