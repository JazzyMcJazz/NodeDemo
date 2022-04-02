import {writable} from "svelte/store";

export const jwtToken = writable(getCookie('jwt'));

function getCookie(cname) {
    let cookies = ` ${document.cookie}`.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0] === ` ${cname}`) {
            return cookie[1];
        }
    }
    return undefined;
}