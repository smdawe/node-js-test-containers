export default async (client, index, memberName) => {
  const q = `member: ${memberName}`;
  const { body } = await client.search({ index, q });

  return body.hits.hits[0]._source;
};
