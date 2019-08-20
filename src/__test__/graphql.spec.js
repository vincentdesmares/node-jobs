const request = require('supertest')
const testDatabase = require('./test-database.js')
const migrateDatabase = testDatabase.migrateDatabase
const seedDatabase = testDatabase.seedDatabase
const getNewServer = testDatabase.getNewServer

const server = getNewServer()

/**
 * Starting the tests
 */
describe('Test the graphql queries', () => {
  beforeAll(async () => {
    await migrateDatabase()
    await seedDatabase()
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  it('QUERY: projects', async () => {
    const response = await request(server.getGraphqlServer()).get(
      `/graphql?query=query getJobs {
              job {
                id
                name    
              }
        }
        &operationName=getJobs`
    )

    expect(response.body).toMatchSnapshot()
  })

  //   it("QUERY: project 1", async () => {
  //     const response = await request(server.getGraphqlServer()).get(
  //       singleProject(1)
  //     );

  //     expect(response.body).toMatchSnapshot();
  //   });

  //   it("QUERY: project 0 non existent", async () => {
  //     const response = await request(server.getGraphqlServer()).get(
  //       singleProject(0)
  //     );

  //     expect(response.body.data.project).toEqual(expect.arrayContaining([]));
  //   });

  //   it("QUERY: project events of project 1 when organizer", async () => {
  //     const response = await request(server.getGraphqlServer()).get(
  //       projectEvents(1)
  //     );

  //     expect(response.body).toMatchSnapshot();
  //   });

  //   it("QUERY: project events of project 1 when not organizer", async () => {
  //     const response = await request(server.getGraphqlServer())
  //       .get(projectEvents(1))
  //       .set("userid", 3);
  //     expect(response.body).toMatchSnapshot();
  //   });

  //   it("QUERY: project events of project 1", async () => {
  //     const response = await request(server.getGraphqlServer())
  //       .get(projectEvents(1))
  //       .set("userid", 3); // Non-organizers should not see the draft or cancelled events
  //     expect(response.body).toMatchSnapshot();
  //   });

  //   it("QUERY: project events of project 0 non existent", async () => {
  //     const response = await request(server.getGraphqlServer()).get(
  //       projectEvents(0)
  //     );

  //     expect(response.body.data.projectEvent).toEqual(expect.arrayContaining([]));
  //   });

  //   it("QUERY: get all users belonging to the same organization", async () => {
  //     const response = await request(server.getGraphqlServer()).get(users());

  //     expect(response.body).toMatchSnapshot();
  //   });

  //   it("QUERY: projects are not available to disabled users", async () => {
  //     const response = await request(server.getGraphqlServer())
  //       .get(projects())
  //       .set("userid", 6);
  //     expect(response.body).toMatchSnapshot();
  //   });
})
