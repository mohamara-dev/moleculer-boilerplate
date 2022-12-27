//#region Global Imports
import { getManager } from 'typeorm';
//#region Global Imports

//#region Local Imports
import { Fetch } from '@Entities/fetch';
//#region Local Imports

const seed = async (): Promise<void> => {
	const entityManager = getManager();
	await entityManager.insert(Fetch, { name: 'Alderaan' });
};

export default {
	seed,
};
