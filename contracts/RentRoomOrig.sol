// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

 
contract RentRoomOrig {

    enum Statuses {
        Vacant,
        Occupied
    }
    Statuses currentStatus;


    event CheckIn(address _occupant, string _message, uint256 _value);
    event CheckOut(address _occupant, string _message, uint256 _value);
    event Log(string func, uint256 gas);
    //
    address payable public owner;
    uint8 qtdDay;
    uint256 bill=0.000099 ether; // starting for 1 day.
    uint256 extra_bill=0.0000000 ether;

     function concatenateStrings(string memory a, string memory b) public pure returns (string memory) {
        bytes memory concatenatedBytes = abi.encodePacked(a, b);
        return string(concatenatedBytes);
    }

    constructor() {
        owner = payable(msg.sender);
        currentStatus = Statuses.Vacant;
    }


    modifier onlyWhileOccupied() {
        require(currentStatus == Statuses.Occupied, "Currently Vacant");
        _;
        
     }

    modifier onlyWhileVacant() {
        require(currentStatus == Statuses.Vacant, "Currently Occupied");
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

    function getCurrentDay() external view returns (uint256) {
       
       return qtdDay;
    }

    function getCurrentBill() external view returns (uint256) {
       
       return bill*qtdDay;
    }

    function addUint8(uint8 a, uint8 b) public pure returns (uint8)
    {
        unchecked {uint8 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c; }

    }

    function addInt256(uint256 a, uint256 b) public pure returns (uint256)
    {
        unchecked {uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;}

    }
   
    fallback() external payable {
        emit Log("fallback error", gasleft());
    }

    receive() external payable {
        emit Log("receive", gasleft());
    }


    function setAddDaysToPay(uint256 _amount, uint8 _qtdDay) public onlyWhileOccupied
    {
        extra_bill=addInt256(extra_bill,_amount);
        qtdDay=addUint8(qtdDay,_qtdDay);
     
    }

   function setReleaseRoom()  external payable onlyWhileOccupied costsRent(bill)  {
             currentStatus = Statuses.Vacant;
             qtdDay=0;
             bill=0;
             extra_bill=0;
             emit CheckOut(msg.sender,"Releasing Room", msg.value);
            // Release the Room.
    }
    function setReserveRoom() external payable onlyWhileVacant costs(0.00001 ether) {
        currentStatus = Statuses.Occupied;
        emit CheckIn(msg.sender,"Room being reserved money was transfered", msg.value);
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
