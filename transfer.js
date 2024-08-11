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


'use strict';

const OperationBase = require('./utils/operation-base');
const SimpleState = require('./utils/simple-state');

/**
 * Workload module for transferring money between accounts.
 */
class Transfer extends OperationBase {

    /**
     * Initializes the instance.
     */
    constructor() {
        super();
    }

    /**
     * Create a pre-configured state representation.
     * @return {SimpleState} The state instance.
     */
    createSimpleState() {
      
        const accountsPerWorker = this.numberOfAccounts / this.totalWorkers;

       console.log("**** Inicio SutContext  ****");
        console.log(this.sutContext);

        console.log("**** Inicio SutAdapter  ****");
        console.log(this.sutAdapter);


      // console.log(this.sutAdapter.web3.eth);

      // this.sutAdapter.web3.eth.getBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').then(m=> console.log(m));
       // console.log("**** Inicio SutAdapter ****");


       // console.log(this.sutAdapter);
        
        return new SimpleState(this.workerIndex, this.initialMoney, this.moneyToTransfer, accountsPerWorker);
    }

    /**
     * Assemble TXs for transferring money.
     */
    async submitTransaction() {

      // console.log(this.roundIndex);
      // console.log(this.workerIndex);
      // console.log(this.roundArguments);

        console.log("Exec Nro -> " + this.sutContext.chainId);
        console.log("Exec GasPrice -> "+ this.sutContext.gasPrice);
        this.sutAdapter.web3.eth.getBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').then(m=> 
            { 
                console.log("**** GET_BALANCE **** " + m);
            });

            this.sutAdapter.web3.eth.getGasPrice().then(m=> 
                { 
                    console.log("**** GAS PRICE **** " + m);
                });

          //  this.sutAdapter.web3.eth.getStorageAt('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',0).then(m=> 
           //     { 
           //         console.log("**** GET_STORAGE_AT (STATE) **** " + m);
           //     });

                this.sutAdapter.web3.eth.getBlock('latest').then(m=> 
                    { 
                        console.log("**** GET BLOCK SIZE **** " + m.size);
                        console.log("**** GET BLOCK COUNT() TRANSACTIONS **** " + m.transactions.length);
                        console.log("**** GET BLOCK GAS LMIT **** " + m.gasLimit);
                        for (var i = 0; i < m.transactions.length; i++) {
                           // console.log(m.transactions[i]);
                            this.sutAdapter.web3.eth.getTransaction(m.transactions[i]).then(j=> 
                                { 
                                //    console.log(j);
                                 console.log("**** GET INPUT DATA TRANSACTION  **** " + j.input);
                                }); 

                          
                        }

                       

                    }); 

                  

                    this.sutAdapter.web3.eth.getTransactionCount('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').then(m=> 
                        { 
                            console.log("**** Qtd Transaction Gerada pelo contrato **** " + m);
                        });
                    
                   
                        


        const transferArgs = this.simpleState.getTransferArguments();

        this.sutAdapter.sendRequests(this.createConnectorRequest('transfer', transferArgs));

        await this.sutAdapter.sendRequests(this.createConnectorRequest('transfer', transferArgs));

         // falta pegar o tamanho de um dado gravado em uma transacao (descobri campo) e o tamanho do dado gerado por um contrato (state + dados)
       
        // https://ethereum.stackexchange.com/questions/147205/how-to-view-the-amount-of-storage-a-contract-uses

//create_access_list
        // console.log(this.sutContext);
       // console.log(this.sutAdapter.web3.eth);
       
        


            

      //  console.log("**** GET_STORAGE_AT ****");
     //   this.sutAdapter.web3.eth.get_storage_at('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',0).then(m=> console.log(m));
 
       // console.log("**** LASTEST BLOCK ****");

        //this.sutAdapter.web3.eth.get_block('latest').then(m => console.log(m));
      
       // get_transaction talvez pegar o valor do gas da transacao

      // fee_history talvez fazer estatistica.


      // getWork ver se a taxa vai aumentar

    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new Transfer();
}

module.exports.createWorkloadModule = createWorkloadModule;
