//#region Local Imports
import FetchSeeder from './FetchSeeder';
//#region Local Imports

const seed = async (): Promise<void> => {
	await FetchSeeder.seed();
};

export default {
	seed,
};
