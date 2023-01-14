declare global {
    interface MyComponentAttributes extends React.HTMLAttributes<HTMLElement> {
        data: any
    }

    interface MyComponent extends React.DetailedHTMLProps<
        MyComponentAttributes,
        HTMLElement
    > {}
    namespace JSX {
        interface IntrinsicElements {
            "my-component": MyComponent;
        }
    }
}

export default global;