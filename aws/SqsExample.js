import { promisify } from "util";
export default async (sqs, QueueUrl) => {
  sqs.receiveMessage = promisify(sqs.receiveMessage);

  const { Messages } = await sqs.receiveMessage({ QueueUrl });

  return Messages[0].Body;
};
