export const getServerSideProps = async ({ query }) => {
    const blogObj = {};
    await fire.firestore()
      .collection('blog')
      .doc(query.id)
      .get()
      .then(result => {
        content['title'] = result.data().title
        content['content'] = result.data().content
      });
    return {
      props: {
        title: blogObj.title,
        content: blogObj.content,
      }
    }
  }