const hre = require("hardhat");
//const { Utils } = require("alchemy-sdk");

async function main() {
  try {
    const studentAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
    const teacherAddress = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc";
    // Connect to the deployed contract
    const contractAddress = "0x0355B7B8cb128fA5692729Ab3AAa199C1753f726" // Replace with your deployed contract address
    
    
    // Get the ContractFactory of your Contract
    const executeContract = await hre.ethers.getContractFactory("AttendanceOrig");

    
    const contract = await executeContract.attach(contractAddress);
    
    //setCreateStudentsArg {
    //  _studId: 138,
    //  _age: 18,
     // _fName: 'Sofia',
     // _lName: 'Porter',
     /// _aStud: '0x52632d20C421616854e0AF5312Df3B7c04fBE057'
   // }

    await contract.setEnRoll(1,2024);
    await contract.createStudent(1, 31,"Joao", "DaSilva",studentAddress);
    await contract.createTeacher(9,"Felipe", "Bueno","Math", teacherAddress);

    
    // var teacherId = await contract.getTeacherList();
    // console.log(teacherId);
    var count = await contract.countStudents();
    console.log(count);

 
      

    //await contract.incrementAttendance(studentAddress, { value: ethers.utils.parseEther("0.3") });
    //console.log(await contract.getParticularStudent(studentAddress));


    //var listStudents = await contract.getStudents();  
    //console.log(listStudents);  

    
  



    

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();