// we always need to import the instrumentation first
import "./instrument.js";

import { makeHttpApplication } from "./adapters/express/app";
import { makeEnv } from "./env";

const main = async () => {
	const env = makeEnv();

	const httpApp = makeHttpApplication({ env });

	httpApp.start();
};

main();
