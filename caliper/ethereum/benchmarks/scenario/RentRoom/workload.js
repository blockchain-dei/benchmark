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
       const args = [ this.QtdDays,  this.QtdUsers,0,0]
     
        return new ContractState(this.workerIndex,args);
    }


    /**
     * Assemble TXs for transferring money.
     */
    async submitTransaction() {
     
       this.startMetrics();
      
        let _Wei;
        _Wei = this.ContractState.getWeiPayableFunction('low');

        console.log('Reserving Room')
        for (let i = 1; i <= this.ContractState.vQtdUsers; i++) {
          console.log("Users trying to reserve (" + i + "/" + this.ContractState.vQtdUsers + ")")
          await this.sendExecFunction('setReserveRoom',[],'5.4.2',_Wei); 
        }
          
        const taxDay= this.ContractState.getTaxDayToPay();
      
        for (let i = 1; i <= this.ContractState.vQtdDays; i++) {
            console.log("Adding days and increasing the bill (" + i + "/" + this.ContractState.vQtdDays + ")")
            await this.sendExecFunction('setAddDaysToPay',taxDay,'7.1.2'); 

            await this.sendExecFunction('getCurrentBill',[],'-', "Query"); 
            await this.sendExecFunction('getCurrentDay',[],'-', "Query"); 
       
            if (this.ContractName=='RentRoomBug'){
              await this.sendExecFunction('getDiscount',[],'5.7.2', "Query"); 
            }
        }    
    
        console.log('Releasing Room')
       
        _Wei = this.ContractState.getWeiPayableFunction('high');
        await this.sendExecFunction('setReleaseRoom',[],'5.4.2',_Wei); 
  
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


module.exports.createWorkloadModule = createWorkloadModule;



