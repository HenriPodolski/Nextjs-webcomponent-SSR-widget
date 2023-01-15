import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import {createElement, FunctionComponent, useEffect, useState} from 'react';
import MyComponent from '@/widgets/my-component/MyComponent';
import ReactDOMServer from 'react-dom/server';




type Props = {
    data: {
        addition: string;
    }
}
const Home: FunctionComponent<Props> = ({ data }) => {
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
    <>
      <Head>
        <title>component-app</title>
        <meta name="description" content="Provides component app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <my-component data={JSON.stringify(currentData)} dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(createElement(MyComponent, { data: currentData })),
        }} />
      </main>
    </>
  )
}

export const getServerSideProps = async () => {
    const data = await fetch('http://localhost:3000/api/hello')
        .then(res => res.json());
    return {
        props: {
            data
        }
    }
}

export default Home;