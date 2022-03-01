const router = require('express').Router();
const fs = require('fs');

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

function renderPage(page) {

    const head = fs.readFileSync('./public/components/head/head.html').toString();
    const nav = fs.readFileSync('./public/components/nav/nav.html').toString();
    const content = fs.readFileSync(`./public/pages/${page}/${page}.html`).toString();
    const footer = fs.readFileSync('./public/components/footer/footer.html').toString();

    return head + nav + content + footer;
}

// GET
router.get('/',        (_, res) => res.send(homePage));    //  /home
router.get('/node',    (_, res) => res.send(nodePage));    //  /node
router.get('/npm',     (_, res) => res.send(npmPage));     //  /npm
router.get('/express', (_, res) => res.send(expressPage)); //  /express
router.get('/nodemon', (_, res) => res.send(nodemonPage)); //  /nodemon
router.get('/ssr',     (_, res) => res.send(ssrPage));     //  /ssr
router.get('/heroku',  (_, res) => res.send(herokuPage));  //  /heroku

module.exports = router;