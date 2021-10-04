import { GenericContainer, Wait } from "testcontainers";
import AWS from "aws-sdk";
import { promisify } from "util";
import { SQS_PORT } from "./config";

import SqsExample from "../../aws/SqsExample";

describe("Test Containers With SQS", () => {
  // Declare the conatiner we want to use
  const localstackContainer = new GenericContainer(
    "localstack/localstack:0.11.0"
  );

  let runningLocalstackContainer;

  beforeAll(async () => {
    runningLocalstackContainer = await localstackContainer
      .withExposedPorts(8080, SQS_PORT)
      .withWaitStrategy(Wait.forLogMessage("Ready.")) // Wait for this log message which tells us that the aws is running
      .start();

    AWS.config.update({ region: "us-east-1" }); // Localstack uses us-east-1 by default

    return runningLocalstackContainer;
  }, 30000); // Allow container some time to start

  let sqs;
  let QueueUrl;

  beforeEach(async () => {
    const awsPort = runningLocalstackContainer.getMappedPort(SQS_PORT); // Get the port that has been mapped to 9200
    const awsAddress = runningLocalstackContainer.getHost(); // Get the address of the container
    const awsEndpoint = `http://${awsAddress}:${awsPort}`;

    sqs = new AWS.SQS({
      endpoint: awsEndpoint,
    }); // point aws client at localstack

    sqs.createQueue = promisify(sqs.createQueue);

    const QueueName = "test";

    const createResult = await sqs.createQueue({ QueueName }); // create a queue

    QueueUrl = createResult.QueueUrl;
  });

  afterEach(async () => {
    sqs.deleteQueue = promisify(sqs.deleteQueue);
    await sqs.deleteQueue({ QueueUrl });
  });

  it("read message from a queue data", async () => {
    sqs.sendMessage = promisify(sqs.sendMessage);

    const MessageBody = "Hello webeng";

    await sqs.sendMessage({ QueueUrl, MessageBody });

    const result = await SqsExample(sqs, QueueUrl);

    expect(result).toBe(MessageBody);
  });
});
