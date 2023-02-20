import ComponentInit from "@/components/ComponentInit";
import {FunctionComponent} from "react";

type Props = {
    data: {
        addition: string;
    }
}
const Home: FunctionComponent<Props> = ({ data }) => {
  return (
      <ComponentInit data={data} />
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