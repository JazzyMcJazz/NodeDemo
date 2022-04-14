import {writable} from "svelte/store";

export const jwtToken = writable(getCookie('jwt'));
export const basket = writable(getCookie('basket'));

export function getCookie(cname) {
    let cookies = ` ${document.cookie}`.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0] === ` ${cname}`) {
            return cookie[1];
        }
    }
    return undefined;
}

export function expireCookie(cname) {
    let cookies = ` ${document.cookie}`.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0] === ` ${cname}`) {
            document.cookie = `${cookie[0]}=${cookie[1]}; max-age=0`;
        }
    }
    jwtToken.set(getCookie(cname))
}

export function addToBasket(id) {
    if (typeof id !== "string")
        id = id.toString();

    const basket = getBasket();

    if (basket.includes(id)) // avoid duplicates
        return true; // id is in basket = true

    basket.push(id);
    document.cookie = `basket=${basket}`;

    return getBasket().includes(id); // extra check just in case
}

export function removeFromBasket(id) {
    if (typeof id !== "string")
        id = id.toString();

    let basket = getBasket();

    basket = basket.filter(item => item !== id); // soft check because item is a string and id is a number

    document.cookie = `basket=${basket}`;

    return getBasket().includes(id); // Extra check just in case
}

export function getBasket() {
    const basket = getCookie('basket');
    if (basket) return basket.split(',');
    return [];
}

