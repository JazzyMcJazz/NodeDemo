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
    window.location.reload();
}