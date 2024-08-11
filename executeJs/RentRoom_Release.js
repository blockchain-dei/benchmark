const hre = require("hardhat");
//const { Utils } = require("alchemy-sdk");

async function main() {
  try {
    // Get the ContractFactory of your Contract
    const executeContract = await hre.ethers.getContractFactory("RentRoomOrig");

    // Connect to the deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Replace with your deployed contract address
    const contract = await executeContract.attach(contractAddress);
   
    var statusRoom = await contract.getStatusRoom();
    console.log("Pt1 Status Room:", statusRoom);

    await contract.setReleaseRoom({
      value: hre.ethers.parseEther("0.031")
      }); 

     statusRoom = await contract.getStatusRoom();
     console.log("Pt2 Status Room:", statusRoom);


  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();