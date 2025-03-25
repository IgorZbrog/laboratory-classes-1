// 📦 Zaimportuj moduły 'fs' oraz 'STATUS_CODE' do obsługi produktów.

// 🏗 Stwórz funkcję 'productRouting', która obsłuży żądania dotyczące produktów.

// 🏗 Stwórz funkcję 'renderAddProductPage', która wyrenderuje stronę dodawania produktu.

// 🏗 Stwórz funkcję 'renderNewProductPage', która wyświetli najnowszy produkt z pliku 'product.txt'.
// Podpowiedź: fileSystem.readFile(...);

// 🏗 Stwóz funkcję 'addNewProduct', która obsłuży dodawanie nowego produktu, zapisywanie go do pliku 'product.txt' oraz przeniesie użytkownika na stronę '/product/new'.
// Podpowiedź: fileSystem.writeFile(...);
// Podpowiedź: response.setHeader("Location", "/product/new");

// 🔧 Wyeksportuj funkcję 'productRouting', aby inne moduł mogły jej używać.

const fs = require("fs");
const STATUS_CODE = require("../constants/statusCode");

function productRouting(request, response) {
    const { url, method } = request;

    if (url === "/product/add" && method === "GET") {
        renderAddProductPage(response);
    } else if (url === "/product/add" && method === "POST") {
        addNewProduct(request, response);
    } else if (url === "/product/new") {
        renderNewProductPage(response);
    } else {
        console.warn(`ERROR: requested url [${url}] doesn’t exist.`);
        response.statusCode = STATUS_CODE.NOT_FOUND;
        response.end();
    }
}

function renderAddProductPage(response) {
    response.setHeader("Content-Type", "text/html");
    response.write(`
        <html>
            <head>
                <title>Shop – Add product</title>
            </head>
            <body>
                <h1>Add product</h1>
                <form action="/product/add" method="POST">
                    <input type="text" name="name" placeholder="Product name" required />
                    <textarea name="description" placeholder="Product description" required></textarea>
                    <button type="submit">Add</button>
                </form>
                <nav>
                    <a href="/">Home</a> |
                    <a href="/product/new">Newest product</a> |
                    <a href="/logout">Logout</a>
                </nav>
            </body>
        </html>
    `);
    response.end();
}

function renderNewProductPage(response) {
    response.setHeader("Content-Type", "text/html");
    fs.readFile("product.txt", "utf8", (err, data) => {
        let productContent = "<p>No new products available.</p>";
        if (!err && data.trim()) {
            const [name, description] = data.split(";");
            productContent = `<h2>${name}</h2><p>${description}</p>`;
        }

        response.write(`
            <html>
                <head>
                    <title>Shop – Newest product</title>
                </head>
                <body>
                    <h1>Newest product</h1>
                    ${productContent}
                    <nav>
                        <a href="/">Home</a> |
                        <a href="/product/add">Add product</a> |
                        <a href="/logout">Logout</a>
                    </nav>
                </body>
            </html>
        `);
        response.end();
    });
}

function addNewProduct(request, response) {
    let body = "";
    request.on("data", (chunk) => {
        body += chunk.toString();
    });

    request.on("end", () => {
        const params = new URLSearchParams(body);
        const name = params.get("name");
        const description = params.get("description");

        if (name && description) {
            fs.writeFile("product.txt", `${name};${description}`, (err) => {
                response.statusCode = STATUS_CODE.FOUND;
                response.setHeader("Location", "/product/new");
                response.end();
            });
        } else {
            response.statusCode = 400;
            response.end("Invalid product data.");
        }
    });
}

module.exports = productRouting;