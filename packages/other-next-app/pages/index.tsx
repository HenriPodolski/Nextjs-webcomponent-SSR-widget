import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import {FunctionComponent} from "react";

type Props = {
    component: string;
}
const Home: FunctionComponent<Props> = ({ component }) => {
  return (
    <>
      <Head>
        <title>App</title>
        <meta name="description" content="App receives component from component-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main} dangerouslySetInnerHTML={{__html: component}}>
      </main>
    </>
  )
}

export const getServerSideProps = async () => {
    const component = await fetch('http://localhost:3000/api/webcomponent')
        .then(res => res.text());
    return {
        props: {
            component
        }
    }
}

export default Home;
