const fs = require('fs');

module.exports = {
    publish: app => {
        home(app);
        node(app);
        npm(app);
        express(app);
        nodemon(app);
        ssr(app);
        heroku(app);
    }
}

// pre-render every page to store in memory
// This way each page only has to be rendering once (when the server starts)
// instead of every time the server receives a request
const homePage    = renderPage('home');
const nodePage    = renderPage('node');
const npmPage     = renderPage('npm');
const expressPage = renderPage('express');
const nodemonPage = renderPage('nodemon');
const ssrPage     = renderPage('ssr');
const herokuPage  = renderPage('heroku');

// GET
const home        = app => app.get('/',        (_, res) => res.send(homePage));    //  /home
const node        = app => app.get('/node',    (_, res) => res.send(nodePage));    //  /node
const npm         = app => app.get('/npm',     (_, res) => res.send(npmPage));     //  /npm
const express     = app => app.get('/express', (_, res) => res.send(expressPage)); //  /express
const nodemon     = app => app.get('/nodemon', (_, res) => res.send(nodemonPage)); //  /nodemon
const ssr         = app => app.get('/ssr',     (_, res) => res.send(ssrPage));     //  /ssr
const heroku      = app => app.get('/heroku',  (_, res) => res.send(herokuPage));  //  /heroku

function renderPage(page) {

    const index = fs.readFileSync('./public/components/head/head.html').toString();
    const nav = fs.readFileSync('./public/components/nav/nav.html').toString();
    const content = fs.readFileSync(`./public/pages/${page}/${page}.html`).toString();
    const footer = fs.readFileSync('./public/components/footer/footer.html').toString();

    return index + nav + content + footer;
}