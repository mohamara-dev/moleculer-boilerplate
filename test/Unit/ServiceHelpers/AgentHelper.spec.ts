// #region Local Imports
import { AgentHelper } from '@ServiceHelpers';
import { DummyContext } from '@Test/Utils';
// #endregion Local Imports

// #region Interface Imports
import { IAgent } from '@Interfaces';
// #endregion Interface Imports

describe('Agent Service Helper Constructor', () => {
	it('should module exist', async () => {
		expect(AgentHelper).toBeDefined();
	});
});

describe('Agent service helpers', () => {
	it('', async () => {
		const params = {};

		const result = await AgentHelper.methodName(DummyContext.getCall(params), params);

		expect(result).toBeDefined();
	});
});
