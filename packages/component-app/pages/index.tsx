import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import {createElement, FunctionComponent, useEffect} from 'react';
import MyComponent from '@/components/my-component/MyComponent';
import ReactDOMServer from 'react-dom/server';




type Props = {
    data: {
        addition: string;
    }
}
const Home: FunctionComponent<Props> = ({ data }) => {
    useEffect(() => {
        import('../components/my-component/component');
    }, []);

  return (
    <>
      <Head>
        <title>component-app</title>
        <meta name="description" content="Provides component app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        {!data && (<pre>!data {JSON.stringify(data)}</pre>)}
      <main className={styles.main}>
        <my-component data={JSON.stringify(data)} dangerouslySetInnerHTML={{
            __html: ReactDOMServer.renderToString(createElement(MyComponent, { data })),
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