import ApiGateway = require('moleculer-web');
import setupDatabase from '@Test/Config/SetupDatabase';
import { getConnection } from 'typeorm';
import { BrokerHelper } from '@Test/Utils';

const request = require("supertest");
const broker = BrokerHelper.setupBroker();
let server;

beforeEach(async () => {
    await setupDatabase();
});

afterEach(async () => {
    await getConnection().close();
});

beforeAll(() => {
    const service = broker.createService(ApiGateway);
    server = service.server;
    return broker.start();
});

afterAll(() => broker.stop());

describe("Test Agent service requests", () => {
    it("Test POST request on Agent service <methodName> method", () => {

        const params = {
            //params
        }

        return request(server)
            .post("/agent/<methodName>")
            .query({ ...params })
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
                expect(res.body).toBe({});
            });
    });
});
