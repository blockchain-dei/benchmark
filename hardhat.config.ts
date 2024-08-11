
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


task("getRandomAccount", "Get Random Account", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  let vAddress=[];
  for (const account of accounts) {
   vAddress.push(account.address)
        //  console.log(account.address);
        //  console.log(vAddress);
  }
  console.log(vAddress[Math.floor(Math.random() * vAddress.length)])
});

const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/LFN2_hY2M2kP2NZHQvmouPYVVtaWXeqh",
      accounts: ["8a43083f1d4406876d3fad18985bcc97c671110a9738b78ab97d1527d004a4ed"]
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.6.7",
        settings: {},
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./caliper/ethereum/abi"
  },

 
  
};

export default config;
