import {createElement, FunctionComponent, useEffect, useState} from 'react';
import MyComponent from '@/widgets/my-component/MyComponent';
import {renderToString} from "react-dom/server";

type Props = {
    data: {
        addition: string;
    }
}
const ComponentInit: FunctionComponent<Props> = ({ data }) => {
    // Set showDynamicChange to true if you want to
    // test attributeChangeCallback behaviour
    const [showDynamicChange] = useState(false);
    const [currentData, setCurrentData] = useState(data);

    useEffect(() => {
        import('../widgets/my-component/component');
    }, []);

    useEffect(() => {
        if (!showDynamicChange) {
            return;
        }

        const indexes = [0,1,2];
        let counter = 0;
        const interval = setInterval(async () => {
            if (!indexes[counter]) {
                counter = 0;
            }
            const fetchedData = await fetch(`http://localhost:3000/api/hello?index=${counter}`)
                .then((res) => res.json())
            setCurrentData(fetchedData);
            counter++;
        }, 1000);

        return () => {clearInterval(interval)}
    }, []);

    return (
        <my-component data={JSON.stringify(currentData)}
            dangerouslySetInnerHTML={{
                __html: `
                    <template shadowroot="open">
                        ${renderToString(
                            createElement(MyComponent, { data: currentData }))
                        }
                    </template>
                `
        }}
        />
    )
}

export default ComponentInit;