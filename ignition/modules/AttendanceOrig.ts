import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AttendanceModuleOrig = buildModule("AttendanceModuleOrig", (m) => {
  const AttendanceOrig = m.contract("AttendanceOrig");
return { AttendanceOrig};
});

export default AttendanceModuleOrig;

