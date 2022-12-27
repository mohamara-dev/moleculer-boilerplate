import CreateConnection from '../../../src/entities/Connection'
import { Connection, getConnection } from 'typeorm'

describe('Connection', async () => {
    it('should return connection and connect', async () => {
        const connection = await CreateConnection()

        expect(connection).toBeInstanceOf(Connection)
        expect(getConnection().isConnected).toBe(true)
    })

    it('should not fail for 2nd connection', async () => {
        await CreateConnection()

        expect(async () => await CreateConnection()).not.toThrow()
    })
})
