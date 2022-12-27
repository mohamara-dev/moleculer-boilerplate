// #region Global Imports
// #endregion Global Imports

// #region Local Imports
import { AgentHelper } from '@ServiceHelpers';
import { BrokerHelper } from '@Test/Utils';
// #endregion Local Imports

// #region Interface Imports
import { IAgent } from '@Interfaces';
// #endregion Interface Imports

const broker = BrokerHelper.setupBroker();

describe('Test Agent service', () => {

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe('Test Agent service actions', async () => {

		it('', async () => {
			const params = {
				// params
			};

			await AgentHelper.methodName(broker as any, params);
		});
	});

});
