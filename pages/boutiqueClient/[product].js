import { useEffect, useState } from 'react';
import fire from '../../config/firebase-config';
import Layout from '../../components/layout';
import Head from 'next/head';
import Link from 'next/link'

const Text = (props) => {
  const [text, setText] = useState(null);
  
//   useEffect(() => {
//     fire.firestore()
//       .collection('OriginalText')
//       .doc(props.id)
//       .get()
//       .then(result => {
//         setText(result.data())
//       })
//   }, []);

//   console.log('text',text); 

  return (
    <Layout>
      <Head>
        <title>Boutique</title>
      </Head>
      <div>
      <h2>{props.name}</h2>
        <p>
          {props.description}
        </p>
      </div>
    </Layout>
  )
}

export const getServerSideProps = async ({ query }) => {
    const content = {}
    console.log(query.product); 
    await fire.firestore()
      .collection('Boutique')
      .doc(query.product)
      .get()
      .then(result => {
        console.log(result.data()); 
        content['name'] = result.data().name
        content['description'] = result.data().description
      });
    return {
      props: {
        name: content.name,
        description: content.description,
      }
    }
  }


export default Text