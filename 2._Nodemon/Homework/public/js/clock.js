const hours = document.querySelector('.clock-hours');
const minutes = document.querySelector('.clock-minutes');
const seconds = document.querySelector('.clock-seconds');

runClock();

function runClock() {

    let date = new Date();
    renderTime(date);

    console.log(date.getHours());

    setTimeout(() => runClock(), 1000);
}

function renderTime(date) {
    hours.innerHTML = getTimeHtml(date.getHours(), 'hour');
    minutes.innerHTML = getTimeHtml(date.getMinutes(), 'minute');
    seconds.innerHTML = getTimeHtml(date.getSeconds(), 'second');
}

function getTimeHtml(currentTime, timeUnit) {

    let constraint = 59
    // let html = `<div class="clock-${timeUnit}">${getTimeUnit(timeUnit)}</div>`;
    let html = ``;
    if (timeUnit === 'hour') constraint = 23


    for (let i = 0; i < 12; i++) {
        let time = currentTime+i;
        let htmlClass = `clock-${timeUnit}`;
        let rgb = 255 - (i * 30);
        let size = (2 - i * 0.15) + 'em';

        if (time > constraint) time = time-(constraint + 1);
        if (i === 0) htmlClass += " current-time";

        let div = `<div style="color: rgb(${rgb}, ${rgb}, ${rgb}); font-size: ${size}" class="${htmlClass}">${formatTime(time)}</div>`

        if (i === 0) div += `<hr/>`

        html += div;
    }
    return html;
}

function formatTime(time) {
    if (time < 10) return '0' + time;
    else return time;
}

function getTimeUnit(timeUnit) {
    switch (timeUnit) {
        case 'hour': return 'hh';
        case 'minute': return 'mm';
        case 'second': return 'ss';
    }

}

