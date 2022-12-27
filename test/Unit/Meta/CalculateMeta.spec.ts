//#region Global Imports
import { getManager, getConnection } from 'typeorm';
//#endregion Global Imports

//#region Local Imports
import setupDatabase from '@Test/Config/SetupDatabase';
import { CalculateMeta } from '@Meta';
import { Fetch } from '@Entities';
//#endregion Local Imports

describe('CalculateMeta constructor', () => {
	it('should be defined', () => {
		expect(CalculateMeta).toBeDefined();
	});
});

describe('CalculateMeta functions', () => {
	beforeEach(async () => {
		await setupDatabase();
	});

	afterEach(async () => {
		await getConnection().close();
	});

	it('should calculate remaining shield', async () => {
		const entityManager = getManager();
		const fetch = await entityManager.findOne(Fetch, { where: { name: 'Alderaan' } });

		const { damage, remainingShield } = await CalculateMeta.Damage(weapon!, fetch!);

		expect(remainingShield).toEqual(fetch!.shield - damage);
	});
});
