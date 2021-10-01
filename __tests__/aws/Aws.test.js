import { GenericContainer, Wait } from "testcontainers";

describe("Test Containers With S3", () => {
  // Declare the conatiner we want to use
  const localstackContainer = new GenericContainer("localstack/localstack");

  let runningLocalstackContainer;

  beforeAll(async () => {
    runningLocalstackContainer = await localstackContainer
      .withExposedPorts(
        8080,
        4567,
        4568,
        4569,
        4570,
        4571,
        4572,
        4573,
        4574,
        4575,
        4576,
        4577,
        4578
      )
      .withWaitStrategy(Wait.forLogMessage("Active license is now [BASIC]")) // Wait for this log message which tells us that the service is running
      .start();

    return runningLocalstackContainer;
  }, 30000); // Allow container sometime to start

  it("query the index", async () => {
    expect(true).toBe(true);
  });
});
