// #region Local Imports
import { FetchHelper } from '@ServiceHelpers';
import { DummyContext } from '@Test/Utils';
// #endregion Local Imports

// #region Interface Imports
import { IFetch } from '@Interfaces';
// #endregion Interface Imports

describe('Fetch Service Helper Constructor', () => {
	it('should module exist', async () => {
		expect(FetchHelper).toBeDefined();
	});
});

describe('Fetch service helpers', () => {
	it('', async () => {
		const params = {};

		const result = await FetchHelper.methodName(DummyContext.getCall(params), params);

		expect(result).toBeDefined();
	});
});
