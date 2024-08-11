import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RentRoomModuleOrig = buildModule("RentRoomModuleOrig", (m) => {
    const RentRoomOrig = m.contract("RentRoomOrig");
  return { RentRoomOrig};
});


export default RentRoomModuleOrig;

