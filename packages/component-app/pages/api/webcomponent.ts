import type { NextApiRequest, NextApiResponse } from 'next'
import { JSDOM } from 'jsdom';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await fetch('http://localhost:3000/webcomponent');
    const html = await response.text();
    const dom = new JSDOM(html);
    const { window } = dom;
    const { document } = window;

    const myComponent = document.querySelector('my-component');
    const scripts = Array.from(document.getElementsByTagName('script')).filter((el) => {
        if (el.src &&
            !el.src.includes('/development') &&
            !el.src.includes('/polyfills') &&
            // !el.src.includes('/main.js') &&
            !el.src.includes('/webpack.js') &&
            !el.src.includes('react-refresh')) {
            return el;
        }
    }).map((el) => {
        el.src = `http://localhost:3000${el.src}`
        return el;
    });
    const styles = Array.from(document.getElementsByTagName('style'));
    const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map((el) => {
        (el as HTMLLinkElement).href = `http://localhost:3000${(el as HTMLLinkElement).href}`
        return el;
    });;
    const tpl = myComponent?.querySelector('template');

    [/*...scripts*/, ...styles, ...styleSheets, ].reverse().forEach((el) => {
        console.log(el?.outerHTML);
        if (tpl?.innerHTML) {
            tpl.innerHTML = `${el?.outerHTML}${tpl?.innerHTML}`;
        }
    });

    console.log(tpl?.innerHTML);

    res.status(200).send(myComponent?.outerHTML);
}
