//#region Global Imports
import { ServiceBroker } from 'moleculer';
//#endregion Global Imports

/* eslint-disable */
//#region Local Imports
const AttackService = require('../../services/attack.service');
const FetchService = require('../../services/fetch.service');
const AgentService = require('../../services/agent.service');
// #endregion Local Imports
/* eslint-enable */

export namespace BrokerHelper {
	export const setupBroker = () => {
		const broker = new ServiceBroker({ logger: false });

		broker.createService(FetchService);
		broker.createService(AgentService);

		return broker;
	};
}
