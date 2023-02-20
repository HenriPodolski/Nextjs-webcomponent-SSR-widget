const ensureDependencies = () => {
    return Promise.all([
        import('@webcomponents/template-shadowroot/template-shadowroot')
    ]);
};
export default class MyWebComponent extends HTMLElement {

    static get observedAttributes() {
        return ['data'];
    }

    shadow: any;

    templateElement: HTMLTemplateElement;
    constructor() {
        super();

        this.templateElement = document.getElementById('my-component-template') as HTMLTemplateElement;

        ensureDependencies().then(([{ hasNativeDeclarativeShadowRoots, hydrateShadowRoots }]) => {
            if (!hasNativeDeclarativeShadowRoots) {
                hydrateShadowRoots(this.parentElement);
            }

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
        });
    }

    attachShadowDomImperatively() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const templateContent = this.templateElement.content;
        this.shadow.appendChild(templateContent.cloneNode(true));
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

    attributeChangedCallback(name: string, newValue: string) {
        if (name === 'data' && newValue) {
            console.log('attributeChangedCallback', newValue);
        }
    }
}

if (!customElements.get('my-component')) {
    customElements.define('my-component', MyWebComponent);
}