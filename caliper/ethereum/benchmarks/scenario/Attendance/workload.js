/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const Utils = require('@hyperledger/caliper-core/lib/common/utils/caliper-utils');
const ethers = require('ethers');

'use strict';

const OperationBase = require('../operation-base');
const ContractState = require('../contract-state');


/**
 * Workload module for transferring money between accounts.
 */
class appExec extends OperationBase {

    /**
     * Initializes the instance.
     */
    constructor() {
        super();
    }
  
    /**
     * Create a pre-configured state representation.
     * @return {ContractState} The state instance.
     */
    createContractState() {
      
      // console.log("**** Printing SutContext  ****");
      // console.log(this.sutContext);


      // console.log("**** Printing SutAdapter  ****");
      // console.log(this.sutAdapter);
      
      const args = [0,0,this.QtdStudents,  this.QtdTeachers]
      return new ContractState(this.workerIndex, args);
    }


    /**
     * Assemble TXs for transferring money.
     */
    async submitTransaction() {

      this.startMetrics();

      let _Wei;
      _Wei = this.ContractState.getWeiPayableFunction('low');
    
      console.log('Set Enroll');
      
      const setEnRollArgs =this.ContractState.getEnroll();
      await this.sendExecFunction('setEnRoll',setEnRollArgs,'-'); 

      console.log('Creating  Students')
      
      for (let i = 1; i <= this.ContractState.vQtdStudents ; i++) {
        let setCreateStudentsArg =this.ContractState.getStudents();
        //console.log('setCreateStudentsArg',setCreateStudentsArg);
        await this.sendExecFunction('createStudent',setCreateStudentsArg,'5.4.2'); 
        await this.sendExecFunction('createStudent',setCreateStudentsArg,'5.4.2'); 
      }    
    
      console.log('Creating  Teachers')
      
      for (let i = 1; i <= this.ContractState.vQtdTeachers; i++) {
        let setCreateTeacherArg =this.ContractState.getTeachers();
        //console.log('setCreateTeacherArg',setCreateTeacherArg);
        await this.sendExecFunction('createTeacher',setCreateTeacherArg,'5.4.2'); 
        await this.sendExecFunction('createTeacher',setCreateTeacherArg,'5.4.2'); 
      }  


      for (let i = 1; i <= this.ContractState.vQtdTeachers * this.ContractState.vQtdStudents; i++) {
          
        console.log('Attendance ... ', i)
        const setAttendanceArg = this.ContractState.setAttendance();
        //console.log('setAttendanceArg',setAttendanceArg);
        await this.sendExecFunction('incrementAttendance',setAttendanceArg,'5.4.2');   
        
        let vAddress;
         if (this.RoundId & 1) // Par
            { 
                vAddress = this.ContractState.getRandomStudentAddress()
                console.log('Running as Student',vAddress);
              }
         else // Impar
            { 
              vAddress = this.ContractState.getRandomTeacherAddress()
              console.log('Running as Teacher',vAddress);
            }
      
            
      let setMsgSender = this.ContractState.getMsgSender(vAddress);
      await this.sendExecFunction('setMsgSender',setMsgSender,'-');  
      
      console.log('Reading students')
      await this.sendExecFunction('getStudents',[],'8.2.1',"Query");   

      console.log('Reading particular student')
      await this.sendExecFunction('getParticularStudent',[],'8.2.1',"Query");  

      console.log('Adding History')
      const setHistoryArg = this.ContractState.getHistory();
     // console.log('setHistoryArg',setHistoryArg);
       await this.sendExecFunction('addHistory',setHistoryArg,'5.16');   

   
      }

      this.stopMetrics();

   
    }

}
 

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new appExec();
}



async function checkCPU(interval) {
  const cpuUsage =  cpu.usage(interval);
  return (cpuUsage);
 }

async function checkMem() {
  const memUsage = await mem.info();
  return  (memUsage['usedMemMb'] );
 }



   


module.exports.createWorkloadModule = createWorkloadModule;



