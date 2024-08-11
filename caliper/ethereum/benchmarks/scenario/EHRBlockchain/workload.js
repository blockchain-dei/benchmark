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
      
      const args = [0,this.QtdUsers,0,0,this.QtdPatients,this.QtdDoctors ]
   
        
        return new ContractState(this.workerIndex, args);
    }


    /**
     * Assemble TXs for transferring money.
     */
    async submitTransaction() {

      console.log('Qtd Patients',this.vQtdPatients);
      console.log('Qtd Doctors',this.vQtdDoctors);

      this.startMetrics();

      let _Wei;
      _Wei = this.ContractState.getWeiPayableFunction('low');
    
      console.log('Starting appointment');
      
      for (let i = 1; i <= this.ContractState.vQtdStudents ; i++) {
      const setStartVisitArgs =this.ContractState.getStartVisit();
      await this.sendExecFunction('start_visit',setStartVisitArgs,'-'); 
      }

      console.log('Registering doctors');
      for (let i = 1; i <= this.ContractState.vQtdDoctors ; i++) {
        const setAddDoctorsArg =this.ContractState.getAddDoctors();
        await this.sendExecFunction('addDoctors',setAddDoctorsArg,'-'); 
      }

      console.log('Registering auditors');
      for (let i = 1; i <= this.ContractState.vQtdUsers ; i++) {
        const setAddAuditsArg =this.ContractState.getAddAudits();
        await this.sendExecFunction('addAudit',setAddAuditsArg,'-'); 
      }

      //setMsgSender = this.ContractState.getMsgSender(vAddress);
      //await this.sendExecFunction('setMsgSender',setMsgSender,'-');  


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



