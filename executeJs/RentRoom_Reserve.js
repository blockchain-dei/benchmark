const hre = require("hardhat");
//const { Utils } = require("alchemy-sdk");

async function main() {
  try {
    // Get the ContractFactory of your Contract
    const executeContract = await hre.ethers.getContractFactory("RentRoomOrig");

    // Connect to the deployed contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Replace with your deployed contract address
    const contract = await executeContract.attach(contractAddress);

    // Retrieve the updated message
      var statusRoom = await contract.getStatusRoom();
        console.log("Pt1 Status Room:", statusRoom);   


    await contract.setReserveRoom({
      value: hre.ethers.parseEther("0.00001")
      }); 


     statusRoom = await contract.getStatusRoom();
     console.log("Pt2 Status Room:", statusRoom);



    //const [owner] = await hre.ethers.getSigners();

   //const transactionHash = await owner.sendTransaction({
   // to: contractAddress,
   // value: hre.ethers.parseEther("0.00001")
  //})/;
  //   value: Utils.parseEther("2.0"), // Sends exactly 1.0 ether
  //  });
    
 
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();