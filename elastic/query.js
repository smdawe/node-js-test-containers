export default async (client, index, member) => {
  const q = `member: ${member}`;
  const { body } = await client.search({ index, q });

  return body.hits.hits[0]._source;
};
