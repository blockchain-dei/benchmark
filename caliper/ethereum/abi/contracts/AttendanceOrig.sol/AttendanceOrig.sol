//https://medium.com/@chinmay.deotale19/revolutionizing-education-with-blockchain-building-a-student-management-system-using-ethereum-and-cc5d9ae9b913

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;



contract AttendanceOrig{
    
    uint roll;
    uint yr;
    uint256 idHist;
    address public vMsgSender;

     modifier onlyTeacher() {
           require(teacherList[vMsgSender].idTeacher>0, "Function reserved only to teacher");
     
        _;
        
     }

     modifier onlyStudent() {
           require(studentList[vMsgSender].idStudent>0, "Function reserved only to student");
     
        _;
        
     }

    //Student members
    struct Student {
        uint age;
        string fName;
        string lName;
        uint attendanceFrequency;
        uint idStudent;
        
       
    }

     //Teacher members
    struct Teacher {
        string fName;
        string lName;
        string discipline;
        uint idTeacher;
        
       
    }

    struct History
    {
        address aTeacher;
        address aStud;
        string commentTeacher;
        uint dateReg;

    }

     event studentCreationEvent(
       string fName,
       string lName,
       uint age
    );

     event teacherCreationEvent(
       string fName,
       string lName,
       string discipline
    );


    mapping (address => Student) studentList;
    mapping (address => Teacher) teacherList;
    mapping (uint256 => History) attendHistory;
    
    address[] public studAddressList;
    address[] public teachAdressList;

    //constructor
    constructor () {
       
    }

     function setEnRoll(uint _roll, uint _year) public
     {
            roll = _roll;
            yr = _year;
     }

     function setMsgSender(address _Sender) public
     {
        vMsgSender = _Sender;
     }

     function createStudent(uint _studId, uint _age,string memory _fName, string memory _lName, address _aStud)  public {
        require(studentList[_aStud].idStudent==0, "Student already registred");
     
        Student memory student;  //  = studentList[_studId];
        
        student.age = _age;
        student.fName = _fName;
        student.lName = _lName;
        student.attendanceFrequency = 0;
        student.idStudent = _studId;
        studentList[_aStud] = student;

        studAddressList.push(_aStud);
        emit studentCreationEvent(_fName, _lName, _age);
    }


     function createTeacher(uint _teachId,string memory _fName, string memory _lName, string memory _discipline, address _aTeach)  public {
        require(teacherList[_aTeach].idTeacher==0, "Teacher already registred");
        Teacher memory teacher;   
        
        teacher.fName = _fName;
        teacher.lName = _lName;
        teacher.discipline = _discipline;
        teacher.idTeacher = _teachId;
        teacherList[_aTeach] = teacher;

        teachAdressList.push(_aTeach);
        emit teacherCreationEvent(_fName, _lName, _discipline);
    }
    
    function incrementAttendance(address _aTeach,  address _aStud)  public  {
        require(teacherList[_aTeach].idTeacher>0,"Invalid teacher");
        require(studentList[_aStud].idStudent>0, "Invalid student");

        studentList[_aStud].attendanceFrequency = studentList[_aStud].attendanceFrequency+1;
 
    }

     function addHistory(address _aStud, address _aTeach, string memory _comment) public onlyTeacher
     {
            History memory _History; 
            _History.commentTeacher = _comment;
            _History.aTeacher = _aTeach;
            _History.dateReg = block.timestamp;
            _History.aStud =_aStud;
             attendHistory[idHist++] = _History;

     }
    
    function getTeacherList() view public onlyTeacher returns(address[] memory) 
    {
       return teachAdressList;
    }

    function getStudents() view public onlyTeacher returns(address[] memory)  {
        return studAddressList;
    }
    
    function getParticularStudent() public view onlyStudent returns (string memory, string memory, uint, uint)   {
        return (studentList[vMsgSender].fName, studentList[vMsgSender].lName, studentList[vMsgSender].age, studentList[vMsgSender].attendanceFrequency);
    }

    function countStudents() view public returns (uint) {
        return studAddressList.length;
    }

  
    
   
}







