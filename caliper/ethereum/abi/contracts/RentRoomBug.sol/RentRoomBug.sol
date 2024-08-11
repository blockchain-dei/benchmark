// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;


contract RentRoomBug {
    enum Statuses {
        Vacant,
        Occupied
    }
    Statuses currentStatus;

    event CheckIn(address _occupant, string _message, uint256 _value);
    event CheckOut(address _occupant, string _message, uint256 _value);

    address payable public owner;
    uint8 qtdDay;
    uint256 bill=0.000099 ether; // starting for 1 day.
    uint256 extra_bill=0.0000000 ether;

     function concatenateStrings(string memory a, string memory b) public pure returns (string memory) {
        bytes memory concatenatedBytes = abi.encodePacked(a, b);
        return string(concatenatedBytes);
    }

    event Log(string func);

    // Bug Injected  1.2 Malicious Fallback Function
    fallback() external payable {
         emit Log("Reserve attempt failed; try again");
       
    }

    receive() external payable {
        emit Log("receive");
    }

    constructor() {
        owner = payable(msg.sender);
        currentStatus = Statuses.Vacant;
    }

    // Bug Injected Wrong Assert Usage. 5.4.2 Wrong Selection of Guard Function
    modifier onlyWhileOccupied() {
        assert(currentStatus == Statuses.Occupied);
        _;
        
     }
    
    // Bug Injected Wrong Assert Usage. 5.4.2 Wrong Selection of Guard Function
    modifier onlyWhileVacant() {
        assert(currentStatus == Statuses.Vacant);
        _;
        }

    modifier costsRent(uint256 _amount) {
        _amount = _amount * qtdDay; 
        require(msg.value >= _amount, concatenateStrings("Pay the room before checkout !!" , toString(_amount)));
        _;
    }
    modifier costs(uint256 _amount) {
        require(msg.value >= _amount, "Not enough Ether provided");
        _;
    }

    function getStatusRoom() external view returns (string memory) {
        if (currentStatus == Statuses.Occupied)
           return "Occupied";
        else  
           return "Vacant";
    }

    function getCurrentBill() external view returns (uint256) {
       
       return bill*qtdDay;
    }

     function getCurrentDay() external view returns (uint256) {
       
       return qtdDay;
    }

    //
    function setAddDaysToPay(uint256 _amount,uint8 _qtdDay) public onlyWhileOccupied
    {
        
       unchecked { qtdDay=qtdDay+_qtdDay; } // Bug Injected Overflow. 7.1.2 Integer Overflow
       unchecked { extra_bill = extra_bill + _amount; } // Bug Injected Overflow. 7.1.2 Integer Overflow. Impact, the user can checkout without pay the bill !! overflow will change the number to 0
    }

   function setReleaseRoom()  external payable onlyWhileOccupied costsRent(bill)  {
             currentStatus = Statuses.Vacant;
             qtdDay=0;
             extra_bill=0;
             bill=0;
             emit CheckOut(msg.sender,"Releasing Room", msg.value);
            // Release the Room.
    }
    function setReserveRoom() external payable onlyWhileVacant costs(0.00001 ether) {
        currentStatus = Statuses.Occupied;
        emit CheckIn(msg.sender,"Room being reserved money was transfered", msg.value);
    }

    // Bug Injected -> 5.7.2 No effect code execution
    // Function is incompleted.
    function getDiscount() view public returns (string memory)  {
        uint256 vDiscount = 0.0001 ether;
        if (currentStatus == Statuses.Occupied)
         {
            
         }
        toString(vDiscount);
        return "Discount applied";
    }

    function toString(uint256 value) internal pure returns (string memory) {
     
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

}
