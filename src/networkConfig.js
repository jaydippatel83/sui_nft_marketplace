import { getFullnodeUrl } from "@mysten/sui/client"; 
import { createNetworkConfig} from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
	createNetworkConfig({
		devnet: {
			url: getFullnodeUrl("devnet"),
			variables: {
				counterPackageId: import.meta.env.VITE_PACKAGE_ID,
			},
		}, 
	});

export { useNetworkVariable, useNetworkVariables, networkConfig };