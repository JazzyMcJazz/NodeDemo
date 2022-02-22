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

const home      = app => app.get('/',        (_, res) => res.send(renderPage('home')));
const node      = app => app.get('/node',    (_, res) => res.send(renderPage('node')));
const npm       = app => app.get('/npm',     (_, res) => res.send(renderPage('npm')));
const express   = app => app.get('/express', (_, res) => res.send(renderPage('express')));
const nodemon   = app => app.get('/nodemon', (_, res) => res.send(renderPage('nodemon')));
const ssr       = app => app.get('/ssr',     (_, res) => res.send(renderPage('ssr')));
const heroku    = app => app.get('/heroku',  (_, res) => res.send(renderPage('heroku')));

const renderPage = page => {

    const index = fs.readFileSync('./public/components/head/head.html').toString();
    const nav = fs.readFileSync('./public/components/nav/nav.html').toString();
    const content = fs.readFileSync(`./public/pages/${page}/${page}.html`).toString();
    const footer = fs.readFileSync('./public/components/footer/footer.html').toString();

    return index + nav + content + footer;
}