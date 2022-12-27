// #region Global Imports
// #endregion Global Imports

// #region Local Imports
import { FetchHelper } from '@ServiceHelpers';
import { BrokerHelper } from '@Test/Utils';
// #endregion Local Imports

// #region Interface Imports
import { IFetch } from '@Interfaces';
// #endregion Interface Imports

const broker = BrokerHelper.setupBroker();

describe('Test Fetch service', () => {

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe('Test Fetch service actions', async () => {

		it('', async () => {
			const params = {
				// params
			};

			await FetchHelper.methodName(broker as any, params);
		});
	});

});
