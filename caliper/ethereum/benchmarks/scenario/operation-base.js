const ethers = require('ethers');
var osu = require('node-os-utils');
var cpu = osu.cpu;
var mem = osu.mem;
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

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

const SupportedConnectors = ['ethereum'];
let fs = require('fs');


/**
 * Base class for simple operations.
 */
class OperationBase extends WorkloadModuleBase {
    /**
     * Initializes the base class.
     */

 

    constructor() {
      
        //console.log("Inicializando OperationBase")
        super();
    }

    /**
     * Initialize the workload module with the given parameters.
     * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
     * @param {number} totalWorkers The total number of workers participating in the round.
     * @param {number} roundIndex The 0-based index of the currently executing round.
     * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
     * @param {ConnectorBase} sutAdapter The adapter of the underlying SUT.
     * @param {Object} sutContext The custom context object provided by the SUT adapter.
     * @async
     */
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {

        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        this.assertConnectorType();
        this.assertSetting('ContractName');
       
        this.ContractName = this.roundArguments.ContractName;
        this.RoundId = this.roundArguments.RoundId;
        this.QtdDays = this.roundArguments.QtdDays;
        this.QtdUsers = this.roundArguments.QtdUsers;
        this.QtdStudents = this.roundArguments.QtdStudents;
        this.QtdTeachers = this.roundArguments.QtdTeachers;
        
        this.ContractState = this.createContractState();

        this.cpuStart=0;
        this.memStart=0;
        this.memEnds=0;
        this._cpuUsage =0;
        this._memStart = 0;
        this._memEnd = 0;


        this.filePath = '/caliper/ethereum/' +  "/output/" + this.RoundId + "_" +  this.ContractName + ".csv";
        this.filePathInput = '/caliper/ethereum/' +  "/output/" + this.RoundId + "_I_" +  this.ContractName + ".csv";
        this.filePathEvent = '/caliper/ethereum/' +  "/output/" + this.RoundId + "_E_" +  this.ContractName + ".csv";
        this.filePathStorage = '/caliper/ethereum/' +  "/output/" + this.RoundId + "_S_" +  this.ContractName + ".csv";
        this.filePathFunction = '/caliper/ethereum/' +  "/output/" + this.RoundId + "_F_" +  this.ContractName + ".csv";

    
        this.writeStream  = fs.createWriteStream(this.filePath);
        this.writeStreamInputData = fs.createWriteStream(this.filePathInput);
        this.writeStreamEvent = fs.createWriteStream(this.filePathEvent);
        this.writeStreamStorage = fs.createWriteStream(this.filePathStorage);
        this.writeStreamFunction  = fs.createWriteStream(this.filePathFunction);
       
        this.writeStream.write(`chain_id;`);
        this.writeStream.write(`roundIndex;`);
        this.writeStream.write(`contract_name;`);
        this.writeStream.write(`fromAddress;`);
        this.writeStream.write(`gas_price_ini;`);
        this.writeStream.write(`gas_price_end;`);
        this.writeStream.write(`balance_ini;`);
        this.writeStream.write(`balance_end;`);
        this.writeStream.write(`block_size_ini;`);
        this.writeStream.write(`block_size_end;`);
        this.writeStream.write(`nro_trans_block_ini;`);
        this.writeStream.write(`nro_trans_block_end;`);
        this.writeStream.write(`gas_limit_ini;`);
        this.writeStream.write(`gas_limit_end;`);
        this.writeStream.write(`nro_trans_affected;`);
        this.writeStream.write(`mem_start;`);
        this.writeStream.write(`mem_End;`);
        this.writeStream.write(`cpu_usage\n`);
  
        this.writeStreamInputData.write(`roundIndex;`);
        this.writeStreamInputData.write(`contract_name;`);
        this.writeStreamInputData.write(`hash;`);
        this.writeStreamInputData.write(`input_data\n`);

        this.writeStreamEvent.write(`roundIndex;`);
        this.writeStreamEvent.write(`contract_name;`);
        this.writeStreamEvent.write(`event_name;`);
        this.writeStreamEvent.write(`rawdata\n`);

        this.writeStreamStorage.write(`roundIndex;`);
        this.writeStreamStorage.write(`contract_name;`);
        this.writeStreamStorage.write(`storage_data\n`);
        
        this.writeStreamFunction.write(`roundIndex;`);
        this.writeStreamFunction.write(`contract_name;`);
        this.writeStreamFunction.write(`function_name;`);
        this.writeStreamFunction.write(`createDate;`);
        this.writeStreamFunction.write(`FinalDate;`);
        this.writeStreamFunction.write(`isCommitted;`);
        this.writeStreamFunction.write(`isVerified;`);
        this.writeStreamFunction.write(`result;`);
        this.writeStreamFunction.write(`OpenSCV;`);
        this.writeStreamFunction.write(`errorMsg\n`)
       
        this._chainId;
        this._gasPriceIni;
        this._gasPriceEnd;
        this._balanceIni;
        this._balanceEnd;
        this._blockSizeIni;
        this._blockSizeEnd;
        this._numTransInBlockIni;
        this._numTransInBlockEnd;
        this._gasLimitIni;
        this._gasLimitEnd;
        this._inputData="";
        this._storageData="";
        this._numTransAffected;
        this._fromAddress;
        this._blockNumberIni;
        this._blockNumberEnd;
        this._deployedAddress;


        this._createDate = "";
        this._finalDate = "";
        this._isCommited = "";
        this._isVerified= "";
        this._errorMsg= "";
        this._result="";

    }

    async stopMetrics()
    {
        this.memEnds = checkMem();
     
     
        await this.cpuStart.then( j=> { this._cpuUsage = j; })
        await this.memStart.then( j=> {  this._memStart = j });
        await this.memEnds.then( j=> {  this._memEnd = j });



       // console.log('Computing Metrics')
       await this.sutAdapter.web3.eth.getTransactionCount(this._fromAddress).then(m=> { 
        this._numTransAffected =  m; // Number of transactions affected by the contract running
    });
        
    this._gasPriceEnd = this.sutContext.gasPrice;
    
    await this.sutAdapter.web3.eth.getBalance(this._fromAddress).then(m=> { 
        this._balanceEnd = m; 
    }); 

   let _blockEnd; 

   await this.sutAdapter.web3.eth.getBlock('latest').then(m=> { 
    _blockEnd = m;
    this._blockNumberEnd = m.number;
    this._gasLimitEnd = _blockEnd.gasLimit;
    this._blockSizeEnd = _blockEnd.size;
    this._numTransInBlockEnd = _blockEnd.transactions.length;
    }); 


    for (var i = 0; i < _blockEnd.transactions.length; i++) {
        await this.sutAdapter.web3.eth.getTransaction(_blockEnd.transactions[i]).then(j=> 
        { 
            this._inputData = this._inputData + j.input;
            this._deployedAddress = j.to; // 
          
            this.writeStreamInputData.write(`${this.RoundId};`);
            this.writeStreamInputData.write(`${this.ContractName};`)
            this.writeStreamInputData.write(`${j.hash};`)
            this.writeStreamInputData.write(`${j.input}\n`);
            
        }); 
    }

    //console.log('Passei Pt 2 ');
  
    for (var i=this._blockNumberIni; i <= this._blockNumberEnd; i++)
    {
        let _block;
        await this.sutAdapter.web3.eth.getBlock(i).then(m=> { 
            _block = m;
            this._gasLimitEnd = _block.gasLimit;
            this._blockSizeEnd = this._blockSizeEnd + _block.size;
            this._numTransInBlockEnd = this._numTransInBlockEnd + _block.transactions.length;
            }); 

            //console.log('entre2 ')
            for (var k = 0; k < _block.transactions.length; k++) {
                await this.sutAdapter.web3.eth.getTransaction(_block.transactions[k]).then(j=> 
                { 
                    this._inputData = this._inputData + j.input;
                    this.writeStreamInputData.write(`${this.RoundId};`);
                    this.writeStreamInputData.write(`${this.ContractName};`)
                    this.writeStreamInputData.write(`${j.hash};`)
                    this.writeStreamInputData.write(`${j.input}\n`);
    
    
                }); 
            }
    }

 
    for (let step = 0; step < 20; step++) {
        //       // Runs 5 times, with values of step 0 through 4.
               //console.log("Trying getStorageAt" + step);
               await this.sutAdapter.web3.eth.getStorageAt(this._deployedAddress, step).then(res=>{ 
               if (res!='0x0000000000000000000000000000000000000000000000000000000000000000')
                   {
                      //console.log("Storage " + res)
                      this._storageData = this._storageData + res;
                      this.writeStreamStorage.write(`${this.RoundId};`);
                      this.writeStreamStorage.write(`${this.ContractName};`)
                      this.writeStreamStorage.write(`${res}\n`)

                  }
                 }) 
   
             }

   
  let _eventRecord="";
  if (this.ContractName=='RentRoomOrig')
  {
   
    let _event;
    let _eventName="";
    let _eventRawData="";

  

  
    _event = await this.sutContext.contracts.RentRoomOrig.contract.getPastEvents("allEvents",  {fromBlock: 0, toBlock: 'latest'});
    for (var i=0; i < _event.length; i++)
    {
      _eventName = _event[i].event
      _eventRawData = _event[i].raw.data;
      _eventRecord = _eventRecord + "[Data " + _eventName + "]" + _eventRawData 

      this.writeStreamEvent.write(`${this.RoundId};`);
      this.writeStreamEvent.write(`${this.ContractName};`)
      this.writeStreamEvent.write(`${_eventName};`)
      this.writeStreamEvent.write(`${_eventRawData}\n`);

    }

  }
  else if (this.ContractName=='RentRoomBug')
  {
   
    let _event;
    let _eventName="";
    let _eventRawData="";
    _event = await this.sutContext.contracts.RentRoomBug.contract.getPastEvents("allEvents",  {fromBlock: 0, toBlock: 'latest'});
    for (var i=0; i < _event.length; i++)
    {
      _eventName = _event[i].event
      _eventRawData = _event[i].raw.data;
      _eventRecord = _eventRecord + "[Data " + _eventName + "]" + _eventRawData 

      this.writeStreamEvent.write(`${this.RoundId};`);
      this.writeStreamEvent.write(`${this.ContractName};`)
      this.writeStreamEvent.write(`${_eventName};`)
      this.writeStreamEvent.write(`${_eventRawData}\n`);

    }

  }


         
    this.writeStream.write(`${this._chainId};`);
    this.writeStream.write(`${this.RoundId};`);
    this.writeStream.write(`${this.ContractName};`);
    this.writeStream.write(`${this._fromAddress};`);
    this.writeStream.write(`${this._gasPriceIni};`);
    this.writeStream.write(`${this._gasPriceEnd};`);
    this.writeStream.write(`${this._balanceIni};`);
    this.writeStream.write(`${this._balanceEnd};`);
    this.writeStream.write(`${this._blockSizeIni};`);
    this.writeStream.write(`${this._blockSizeEnd};`);
    this.writeStream.write(`${this._numTransInBlockIni};`);
    this.writeStream.write(`${this._numTransInBlockEnd};`);
    this.writeStream.write(`${this._gasLimitIni};`);
    this.writeStream.write(`${this._gasLimitEnd};`);
    this.writeStream.write(`${this._numTransAffected};`);
    this.writeStream.write(`${this._memStart};`);
    this.writeStream.write(`${this._memEnd};`);
    this.writeStream.write(`${this._cpuUsage}\n`);

    console.log('Saving data... ');
    this.writeStream.end();
    this.writeStreamInputData.end();
    this.writeStreamEvent.end();
    this.writeStreamStorage.end();
    this.writeStreamFunction.end();
    }
  

    startMetrics()
    {
        this.memStart = checkMem();
        this.cpuStart = checkCPU(1000);
  
  
        this._fromAddress =  this.sutContext.fromAddress; 
        this._chainId =this.sutContext.chainId;
        this._gasPriceIni = this.sutContext.gasPrice; 
            
        this.sutAdapter.web3.eth.getBalance(this._fromAddress).then(m=> { 
        this._balanceIni = m;  
        });
  
        
          this.sutAdapter.web3.eth.getBlock('latest').then(m=> { 
              this._blockSizeIni = m.size;
              this._numTransInBlockIni = m.transactions.length;
              this._gasLimitIni = m.gasLimit;
              this._blockNumberIni = m.number;
    
          }); 
    }

    async sendExecFunction(pFunctionName,pParamArgs, pOpenSCV, pWei)
    {
     // console.log(pFunctionName);
     // console.log(pParamArgs);
      

      if (pWei==undefined) 
      {
        //console.log('aki');
        await this.sutAdapter.sendRequests(this.createConnectorRequest(pFunctionName,pParamArgs)).then(m=> { 
            this._createDate =  m.GetTimeCreate();
            this._finalDate =   m.GetTimeFinal();
            this._isCommited =  m.IsCommitted();
            this._isVerified =  m.IsVerified();
            this._errorMsg =    m.GetErrMsg();
            
            this.writeStreamFunction.write(`${this.RoundId};`);
            this.writeStreamFunction.write(`${this.ContractName};`);
            this.writeStreamFunction.write(`${pFunctionName};`);
            this.writeStreamFunction.write(`${this._createDate};`);
            this.writeStreamFunction.write(`${this._finalDate};`);
            this.writeStreamFunction.write(`${this._isCommited};`);
            this.writeStreamFunction.write(`${this._isVerified};`);
            this.writeStreamFunction.write(`${this._result};`);
            this.writeStreamFunction.write(`${pOpenSCV};`);
            this.writeStreamFunction.write(`${this._errorMsg}\n`);});
        }
        else if (pWei == "Query")
        {
            await this.sutAdapter.sendRequests(this.createConnectorRequest(pFunctionName,pParamArgs, [], true)).then(m=> { 
            this._result =  m.status.result;
            //console.log(m);
            //console.log(pFunctionName, this._result);

            this._createDate =  m.GetTimeCreate();
            this._finalDate =   m.GetTimeFinal();
            this._isCommited =  m.IsCommitted();
            this._isVerified =  m.IsVerified();
            this._errorMsg =    m.GetErrMsg();
            
            this.writeStreamFunction.write(`${this.RoundId};`);
            this.writeStreamFunction.write(`${this.ContractName};`);
            this.writeStreamFunction.write(`${pFunctionName};`);
            this.writeStreamFunction.write(`${this._createDate};`);
            this.writeStreamFunction.write(`${this._finalDate};`);
            this.writeStreamFunction.write(`${this._isCommited};`);
            this.writeStreamFunction.write(`${this._isVerified};`);
            this.writeStreamFunction.write(`${this._result};`);
            this.writeStreamFunction.write(`${pOpenSCV};`);
            this.writeStreamFunction.write(`${this._errorMsg}\n`);});
            return this._result;
        }
      else
      {
        await this.sutAdapter.sendRequests(this.createConnectorRequest(pFunctionName,pParamArgs, pWei,false)).then(m=> { 
            //console.log(m);
            this._createDate =  m.GetTimeCreate();
            this._finalDate =   m.GetTimeFinal();
            this._isCommited =  m.IsCommitted();
            this._isVerified =  m.IsVerified();
            this._errorMsg =    m.GetErrMsg();
            
            this.writeStreamFunction.write(`${this.RoundId};`);
            this.writeStreamFunction.write(`${this.ContractName};`);
            this.writeStreamFunction.write(`${pFunctionName};`);
            this.writeStreamFunction.write(`${this._createDate};`);
            this.writeStreamFunction.write(`${this._finalDate};`);
            this.writeStreamFunction.write(`${this._isCommited};`);
            this.writeStreamFunction.write(`${this._isVerified};`);
            this.writeStreamFunction.write(`${this._result};`);
            this.writeStreamFunction.write(`${pOpenSCV};`);
            this.writeStreamFunction.write(`${this._errorMsg}\n`);});
        }
    }


    /**
     * Performs the operation mode-specific initialization.
     * @return {SimpleState} the initialized SimpleState instance.
     * @protected
     */
    createContractState() {
        throw new Error('Workload error: "createContractState" must be overridden in derived classes');
    }

    /**
     * Assert that the used connector type is supported. Only Fabric is supported currently.
     * @protected
     */
    assertConnectorType() {
        this.connectorType = this.sutAdapter.getType();
        if (!SupportedConnectors.includes(this.connectorType)) {
            throw new Error(`Connector type ${this.connectorType} is not supported by the benchmark`);
        }
    }

    /**
     * Assert that a given setting is present among the arguments.
     * @param {string} settingName The name of the setting.
     * @protected
     */
    assertSetting(settingName) {
        if(!this.roundArguments.hasOwnProperty(settingName)) {
            throw new Error(`Workload error: module setting "${settingName}" is missing from the benchmark configuration file`);
        }
    }

    /**
     * Assemble a connector-specific request from the business parameters.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The connector-specific request.
     * @protected
     */
    createConnectorRequest(operation, args, value, query) {
        switch (this.connectorType) {
            case 'ethereum':
                return this._createEthereumConnectorRequest(operation, args, value,query);
            default:
                // this shouldn't happen
                throw new Error(`Connector type ${this.connectorType} is not supported by the benchmark`);
        }
    }

    /**
     * Assemble a Ethereum-specific request from the business parameters.
     * @param {string} operation The name of the operation to invoke.
     * @param {object} args The object containing the arguments.
     * @return {object} The Ethereum-specific request.
     * @private
     */
    _createEthereumConnectorRequest(operation, args, _value, _query) {
        //console.log("Contract Name " +  this.ContractName)
        //const query = operation === 'query';
       // console.log("Payable Function " + _value);
       // console.log(hre.ethers.parseEther("0.00001"));
       // console.log(ethers.utils.formatEther("Value "+  _value));
        if (_query==true) 
        {
                return {
                    contract: this.ContractName,
                    verb: operation,
                    //value: _value, // hre.ethers.parseEther("0.00001"),
                    args: Object.keys(args).map(k => args[k]),
                    readOnly: true,
                
                }
         }
        else
        {
            return {
                contract: this.ContractName,
                verb: operation,
                value: _value, // hre.ethers.parseEther("0.00001"),
                args: Object.keys(args).map(k => args[k]),
               // readOnly: false,
            }
        }

       
       
    }
}

async function checkMem() {
    const memUsage = await mem.info();
    return  (memUsage['usedMemMb'] );
   }


async function checkCPU(interval) {
    const cpuUsage =  cpu.usage(interval);
    return (cpuUsage);
   }

module.exports = OperationBase;
