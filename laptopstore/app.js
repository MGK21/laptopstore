const http = require('http');
const fs = require('fs');
const url = require('url');

const overview = fs.readFileSync("./templates/overview.html").toString();
const data = JSON.parse(fs.readFileSync("./data/data.json").toString());
const temaple_card = fs.readFileSync("./templates/template_card.html").toString();
const laptop = fs.readFileSync("./templates/laptop.html").toString();

function renderOverview(data) {
    let cardArr = [];
    for (let i = 0; i < data.length; i++) {
        let newCard = temaple_card;
        newCard = newCard.replace(/{image}/g, data[i].image)
            .replace(/{productName}/g, data[i].productName)
            .replace(/{screen}/g, data[i].screen)
            .replace(/{cpu}/g, data[i].cpu)
            .replace(/{id}/g, "?id=" + data[i].id)
            .replace(/{price}/g, data[i].price);
        cardArr.push(newCard);
    }
    return overview.replace(`<div class="cards-container"></div>`, `<div class="cards-container">${cardArr.join("")}</div>`)
}

function renderLaptop(laptopData) {
    return laptop.replace(/{image}/g, laptopData.image)
        .replace(/{productName}/g, laptopData.productName)
        .replace(/{screen}/g, laptopData.screen)
        .replace(/{cpu}/g, laptopData.cpu)
        .replace(/{price}/g, laptopData.price)
        .replace(/{ram}/g, laptopData.ram)
        .replace(/{storage}/g, laptopData.storage)
        .replace(/{description}/g, laptopData.description);

}

const server = http.createServer((req, res) => {
    let parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/overview' || parsedUrl.pathname === '/overview.html') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(renderOverview(data));
    } else if (parsedUrl.pathname === '/laptop.html') {
        const id = parseInt(parsedUrl.query.id);
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(renderLaptop(data[id]));
    } else if ((/.(gif|jpg|jpeg|jfif|png|svg)$/).test(parsedUrl.pathname)) {
        fs.readFile(`./img${parsedUrl.pathname}`, (err, image) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                res.end(`File ./img${parsedUrl.pathname} not found`);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'image/jpg'
                });
                res.end(image);
            }
        })
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });
        res.end("<h1>File not Found</h1>");
    }
});

server.listen(7500, '127.0.0.1', () => {
    console.log("I am a cute server, I am listening at the port 7500");
});