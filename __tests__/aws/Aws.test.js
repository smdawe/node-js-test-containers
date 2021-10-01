import { GenericContainer, Wait } from "testcontainers";

describe("Test Containers With S3", () => {
  // Declare the conatiner we want to use
  const elasticsearchContainer = new GenericContainer("localstack/localstack");

  let runningElasticsearchContainer;
  let elasticsearchClient;

  beforeAll(async () => {
    runningElasticsearchContainer = await elasticsearchContainer
      .withExposedPorts(ELASTICSEARCH_PORT) // Expose port 9200 on the conatiner
      .withEnv("discovery.type", "single-node") // Tell elasticsearch that there is only one node
      .withWaitStrategy(Wait.forLogMessage("Active license is now [BASIC]")) // Wait for this log message which tells us that the service is running
      .start();

    return runningElasticsearchContainer;
  }, 30000); // Allow container sometime to start

  beforeEach(async () => {
    const elasticsearchPort =
      runningElasticsearchContainer.getMappedPort(ELASTICSEARCH_PORT); // Get the port that has been mapped to 9200
    const elasticsearchAddress = runningElasticsearchContainer.getHost(); // Get the address of the container
    const elasticsearchEndpoint = `http://${elasticsearchAddress}:${elasticsearchPort}`;

    console.log(`Elasticsearch is available on ${elasticsearchEndpoint}`);

    elasticsearchClient = new Client({ node: elasticsearchEndpoint });

    const x = await elasticsearchClient.indices.create({
      index: ELASTICSEARCH_INDEX,
      body: index,
    }); // Create test index

    await elasticsearchClient.index({
      index: ELASTICSEARCH_INDEX,
      body: data,
      refresh: true,
    });
  });

  afterEach(async () => {
    await elasticsearchClient.indices.delete({ index: ELASTICSEARCH_INDEX }); // Delete test index
  });

  it("query the index", async () => {
    const res = await elasticsearch(
      elasticsearchClient,
      ELASTICSEARCH_INDEX,
      "Corey Taylor"
    );

    expect(res.band).toBe("Slipknot");
  });
});
