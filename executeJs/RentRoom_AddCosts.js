const hre = require("hardhat");
//const { Utils } = require("alchemy-sdk");

async function main() {
  try {
    // Get the ContractFactory of your Contract
    const executeContract = await hre.ethers.getContractFactory("RentRoomOrig");

    // Connect to the deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Replace with your deployed contract address
    const contract = await executeContract.attach(contractAddress);
   
    var statusRoom = await contract.getCurrentBill();
    console.log("Pt1 getCurrent Bill:", statusRoom);

    (abi.encodeCall(Counter.get, ()), abi.encodeCall(Counter.inc, ()));
    
    //await contract.setAddDaysToPay(hre.ethers.parseEther("0.0099"),50); 

    // statusRoom = await contract.getCurrentBill2();
   //  console.log("Pt2 getCurrent Bill:", statusRoom);


  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();