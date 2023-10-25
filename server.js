const express = require('express');
var server = express();
const fs = require('fs');
var path = require('path');

var static = path.join(__dirname, 'static');

var langAndStrings = JSON.parse(fs.readFileSync(path.join(__dirname, '/langAndStrings.json'), 'utf8'));
var content = JSON.parse(fs.readFileSync(path.join(__dirname, '/content.json'), 'utf8'));
var strings = langAndStrings.strings;
var languages = langAndStrings.languages;

server.get('/', function (req, res) {
    for (i = 0; i < languages.available.length; i++) {
        if (req.headers["accept-language"].includes(languages.available[i])) {
            res.redirect('/' + languages.available[i]);
        }
    }
    res.redirect('/' + languages.default);
});

server.get('/favicon.ico', (req, res) => res.status(204));

server.use('/static', express.static(static));

server.set('view engine', 'ejs');

server.use(middle);

function middle(req, res, next) {
    var language = "";

    if (req.originalUrl.split('/')[1] != languages.default) {
        for (i = 0; i < languages.available.length; i++) {
            if (req.originalUrl.split('/')[1] == languages.available[i]) {
                language = languages.available[i];
            }
        }
        if(language == "") {
            res.redirect('/');
        }
    }
    if (req.originalUrl.split('/')[2] == undefined || req.originalUrl.split('/')[2] == "") {
        res.render('index', { language: language, strings: strings, content: content });
    }

    console.log(req.originalUrl.split('/')[2]);
    console.log(req.originalUrl);
    next();
}

server.listen(3000, function () {
    console.log('Server listening on port 3000');
});