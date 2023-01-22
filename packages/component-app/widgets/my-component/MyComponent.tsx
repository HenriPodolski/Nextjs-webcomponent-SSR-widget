import styles from './MyComponent.module.scss';
import {FunctionComponent} from 'react';

export type MyComponentProps = {
    data?: {
        addition: string;
    }
}
const MyComponent: FunctionComponent<MyComponentProps> = ({ data }) => {
    return (
        <div className={styles.MyComponent}>
            This is a React component wrapped in a webcomponent <span onClick={() => console.log('clicked')}>{data?.addition}</span>
        </div>
    );
};

export default MyComponent