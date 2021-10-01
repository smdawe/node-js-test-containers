import { promisify } from "util";

export default async (sqsClient, QueueUrl) => {
  sqsClient.receiveMessage = promisify(sqsClient.receiveMessage);

  const { Messages } = await sqsClient.receiveMessage({ QueueUrl }); // Get messages from a queue

  return Messages[0].Body; // Return body of the first message
};
