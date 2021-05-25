// health check URL
function Ping() {
  console.log("foo");
}

// This gets called on every request
export async function getServerSideProps(context) {
  context.res.end("OK");
  return { props: {} };
}

export default Ping;
