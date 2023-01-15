import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import MyComponent, { MyComponentProps } from '@/components/my-component/MyComponent';

export default class MyWebComponent extends HTMLElement {

    reactRoot: any;

    mountPoint: any;

    shadow: any;
    constructor() {
        super();

        // Safari does not support this feature. https://caniuse.com/mdn-api_htmlelement_attachinternals
        if (typeof this.attachInternals === 'function') {
            const internals = this.attachInternals();

            this.shadow = internals.shadowRoot;

            // If the Declarative Shadow Root does not exist (i.e., SSR/SSG content does not exist), then imperatively set up the shadow root and populate it with content.
            // When imperatively setting up the shadow root, the HTML content is not wrapped within a `<template />` tag.
            if (!this.shadow) {
                this.attachShadowDomImperatively();
            }
        } else {
            this.attachShadowDomImperatively();
        }
    }

    createReactComponent() {
        const data: MyComponentProps['data'] = this.parseAttributeData(
            this.getAttribute('data') ?? ''
        ) as MyComponentProps['data'];

        return createElement(MyComponent, { data });
    }

    attachShadowDomImperatively() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const serverRenderedHTML = this.innerHTML;
        this.mountPoint = document.createElement('div');
        this.mountPoint.innerHTML = serverRenderedHTML;
        const myComponent = this.createReactComponent();
        this.reactRoot = hydrateRoot(this.mountPoint as unknown as Element, myComponent);

        const getStyleSheet = () => {
            return Array.from(document.styleSheets).reduce((prev: string, styleSheet: CSSStyleSheet) => {
                if (styleSheet.cssRules[0] && styleSheet.cssRules[0].cssText.startsWith('.MyComponent_MyComponent')) {
                    prev = styleSheet.cssRules[0].cssText;
                }

                return prev;
            }, '');
        }


        const styleElement = document.createElement('style');
        styleElement.innerHTML = getStyleSheet();

        this.shadow.appendChild(styleElement);
        this.shadow.appendChild(this.mountPoint);
        this.innerHTML = '';
    }

    parseAttributeData(data: string) {
        let attributeData = {};
        try {
            attributeData = JSON.parse(data);
        } catch (e) {
            console.error(e);
        }

        return attributeData;
    }
}

if (!customElements.get('my-component')) {
    customElements.define('my-component', MyWebComponent);
}