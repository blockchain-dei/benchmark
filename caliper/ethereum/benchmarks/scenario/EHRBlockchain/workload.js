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

    const args = [0, this.QtdUsers, 0, 0, this.QtdPatients, this.QtdDoctors]
    //console.log('Qtd Patients',this.QtdPatients);
    //console.log('Qtd Patients',this.QtdDoctors);



    return new ContractState(this.workerIndex, args);
  }


  /**
   * Assemble TXs for transferring money.
   */
  async submitTransaction() {

    console.log('Qtd Patients', this.ContractState.vQtdPatients);
    console.log('Qtd Doctors', this.ContractState.vQtdDoctors);
    

    this.startMetrics();

    let vListAppointId=[];
    let vListDoctors=[];
    let vListPatients=[];
    let vListAuditors=[];
    let vAddress;
    if (this.RoundId & 1) // Par
    {
      vAddress = this.ContractState._getRandomAccount()
     // console.log('Send Msg', vAddress);
    }
    else // Impar
    {
      vAddress = this.ContractState._getRandomAccount()
     // console.log('Send Msg', vAddress);
    }


    let setMsgSender = this.ContractState.getMsgSender(vAddress);
    await this.sendExecFunction('setMsgSender', setMsgSender, '-');


 

    let setPatientInfoArgs = this.ContractState.getPatientInfoArgs();
    //console.log('setPatientInfoArgs',setPatientInfoArgs);

    await this.sendExecFunction('setInfo', setPatientInfoArgs, '-');


    let _Wei;
    _Wei = this.ContractState.getWeiPayableFunction('low');

    console.log('Starting appointment');

    for (let i = 1; i <= this.ContractState.vQtdPatients; i++) {
      let vAppointmentId = await this.sendExecFunction('setCreatePatientID',[],'-','Query');

      const setStartVisitArgs = this.ContractState.getStartVisit(vAppointmentId);
      //console.log('setStartVisitArgs', setStartVisitArgs)
      await this.sendExecFunction('start_visit', setStartVisitArgs, '-');
      //console.log('vPatientId',vPatientId);
      vListAppointId.push(vAppointmentId);
    }


    console.log('Registering doctors');
    for (let i = 1; i <= this.ContractState.vQtdDoctors; i++) {
      const setAddDoctorsArg = this.ContractState.getAddDoctors();
      //console.log('setAddDoctorsArg _doctor_address', setAddDoctorsArg._doctor_address)
      vListDoctors.push(setAddDoctorsArg._doctor_address);
      await this.sendExecFunction('addDoctors', setAddDoctorsArg, '-', "Query");
    }



    console.log('Registering auditors');
    for (let i = 1; i <= this.ContractState.vQtdUsers; i++) {
      const setAddAuditsArg = this.ContractState.getAddAudits();
     // console.log('setAddAuditsArg', setAddAuditsArg)
     vListAuditors.push(setAddAuditsArg._audit_address);
      await this.sendExecFunction('addAudit', setAddAuditsArg, '-', "Query");
    }



    vListAppointId.forEach(async function getRecord(entry) {
     
      //console.log(entry);
      const setRecordDetailsArgs = this.ContractState.getRecordDetailsArg(entry);

      let vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get',vRet);


      console.log('setRecordDetailsArgs',setRecordDetailsArgs);

      await this.sendExecFunction('print_record', setRecordDetailsArgs, '-');
      
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get2',vRet);

      await this.sendExecFunction('doctor_query_record', setRecordDetailsArgs, '-');
     
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get3',vRet);

      await this.sendExecFunction('doctor_print_record', setRecordDetailsArgs, '-');
     
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get4',vRet);

      await this.sendExecFunction('doctor_copy_record', setRecordDetailsArgs, '-');
      
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get5',vRet);

      await this.sendExecFunction('doctor_update_record', setRecordDetailsArgs, '-');
     
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get6',vRet);

      await this.sendExecFunction('doctor_delete_record', setRecordDetailsArgs, '-');
      
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get7',vRet);

      await this.sendExecFunction('delete_record', setRecordDetailsArgs, '-');
     
      vRet =  await this.sendExecFunction('get_record_details', setRecordDetailsArgs , '-', "Query");
      console.log('vRet Get8',vRet);


      

      
      

      
      




    }, this);



  

    


    
    
 


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
  const cpuUsage = cpu.usage(interval);
  return (cpuUsage);
}

async function checkMem() {
  const memUsage = await mem.info();
  return (memUsage['usedMemMb']);
}






module.exports.createWorkloadModule = createWorkloadModule;



