
#////////////////////////////////////////////////
#///////////////// PARAMETERS ///////////////////
#////////////////////////////////////////////////


MAX_ROUND=1
MAX_QTD_STUDENTS=1
MAX_QTD_TEACHERS=1

START=""
STOP=""


CONTRACT_NAME_ORIG="AttendanceOrig"
CONTRACT_DEPLOYER_ADDRESS_ORIG="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
CONTRACT_DEPLOYER_ADDRESS_PK_ORIG="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
FROM_ADDRESS_ORIG="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
FROM_ADDRESS_PK_ORIG="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
CONTRACT_PATH_ORIG="./abi/contracts/$CONTRACT_NAME_ORIG.sol/$CONTRACT_NAME_ORIG.json"


CONTRACT_NAME_BUG="AttendanceBug"
CONTRACT_DEPLOYER_ADDRESS_BUG="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
CONTRACT_DEPLOYER_ADDRESS_PK_BUG="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
FROM_ADDRESS_BUG="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
FROM_ADDRESS_PK_BUG="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
CONTRACT_PATH_BUG="./abi/contracts/$CONTRACT_NAME_BUG.sol/$CONTRACT_NAME_BUG.json"


 

rm /caliper/ethereum/output/*.csv -f
rm /caliper/ethereum/output/*.html -f
rm /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json -f;
rm /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json -f;


merge_orig=''
merge_bug=''

merge_orig_b=''
merge_bug_b=''

merge_orig_s=''
merge_bug_s=''

merge_orig_e=''
merge_bug_e=''

merge_orig_i=''
merge_bug_i=''

merge_orig_f=''
merge_bug_f=''

for i in `seq 1 $MAX_ROUND`
do
echo "Round  $i ...."

if [ $i = 1 ]; then
   STOP=". /hardhat/nothing.sh"
   START=". /hardhat/start.sh"
else
   START=". /hardhat/nothing.sh"
   STOP=". /hardhat/nothing.sh"
fi

k=$((1 + RANDOM % $MAX_QTD_TEACHERS))
j=$((1 + RANDOM % $MAX_QTD_STUDENTS)) 

yq -Yi '.test.rounds[0].workload.arguments.RoundId = '$i''   benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdStudents = '$k''   benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdTeachers = '$j''   benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml

yq -Yi '.test.rounds[0].workload.arguments.RoundId = '$i''   benchmarks/scenario/$CONTRACT_NAME_BUG/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdStudents = '$k''   benchmarks/scenario/$CONTRACT_NAME_BUG/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdTeachers = '$j''   benchmarks/scenario/$CONTRACT_NAME_BUG/config.yaml

merge_orig="${i}_$CONTRACT_NAME_ORIG.csv ${merge_orig}"
merge_bug="${i}_$CONTRACT_NAME_BUG.csv ${merge_bug}"

merge_orig_b="${i}_B_$CONTRACT_NAME_ORIG.csv ${merge_orig_b}"
merge_bug_b="${i}_B_$CONTRACT_NAME_BUG.csv ${merge_bug_b}"

merge_orig_s="${i}_S_$CONTRACT_NAME_ORIG.csv ${merge_orig_s}"
merge_bug_s="${i}_S_$CONTRACT_NAME_BUG.csv ${merge_bug_s}"

merge_orig_e="${i}_E_$CONTRACT_NAME_ORIG.csv ${merge_orig_}"
merge_bug_e="${i}_E_$CONTRACT_NAME_BUG.csv ${merge_bug_e}"

merge_orig_i="${i}_I_$CONTRACT_NAME_ORIG.csv ${merge_orig_i}"
merge_bug_i="${i}_I_$CONTRACT_NAME_BUG.csv ${merge_bug_i}"

merge_orig_f="${i}_F_$CONTRACT_NAME_ORIG.csv ${merge_orig_f}"
merge_bug_f="${i}_F_$CONTRACT_NAME_BUG.csv ${merge_bug_f}"


sleep 1

jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_ORIG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_ORIG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_ORIG}"\"': {"path":'\""${CONTRACT_PATH_ORIG}"\"', "estimateGas": true, "gas": {"setReserveRoom": 500000, "setReleaseRoom": 500000, "setAddDaysToPay": 500000  }  } }    ' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json
jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_BUG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_BUG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_BUG}"\"': {"path":'\""${CONTRACT_PATH_BUG}"\"', "estimateGas": true, "gas": {"setReserveRoom": 500000, "setReleaseRoom": 500000, "setAddDaysToPay": 500000 }  }  }     ' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json


 workPath='benchmarks/scenario/AttendanceOrig/workload.js';

 yq -Yi '.test.rounds[0].workload.module = '\""$workPath"\"''  benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml
 yq -Yi '.test.rounds[0].workload.module = '\""$workPath"\"''  benchmarks/scenario/$CONTRACT_NAME_BUG/config.yaml


npx caliper launch manager \
    --caliper-bind-sut ethereum:1.3 \
    --caliper-workspace . \
    --caliper-benchconfig benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml \
    --caliper-networkconfig /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json 

npx caliper launch manager \
    --caliper-bind-sut ethereum:1.3 \
    --caliper-workspace . \
    --caliper-benchconfig benchmarks/scenario/$CONTRACT_NAME_BUG/config.yaml \
    --caliper-networkconfig /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json

done


echo "Merging Files"

cd output
csvstack ${merge_orig} ${merge_bug} > merged.csv
csvstack ${merge_orig_b} ${merge_bug_b} > merged_b.csv
csvstack ${merge_orig_e} ${merge_bug_e} > merged_e.csv
csvstack ${merge_orig_i} ${merge_bug_i} > merged_i.csv
csvstack ${merge_orig_s} ${merge_bug_s} > merged_s.csv
csvstack ${merge_orig_f} ${merge_bug_f} > merged_f.csv
cd ..



for i in `seq 1 $MAX_QTD_TEACHERS`
do

# Workload2
cd /hardhat
ADDRESS=$(npx hardhat getRandomAccount)
echo "$ADDRESS"
cd /caliper/ethereum

CONTRACT_NAME_ORIG="AttendanceOrig"
CONTRACT_DEPLOYER_ADDRESS_ORIG="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
CONTRACT_DEPLOYER_ADDRESS_PK_ORIG="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
FROM_ADDRESS_ORIG=$ADDRESS
FROM_ADDRESS_PK_ORIG=""
CONTRACT_PATH_ORIG="./abi/contracts/$CONTRACT_NAME_ORIG.sol/$CONTRACT_NAME_ORIG.json"


CONTRACT_NAME_BUG="AttendanceBug"
CONTRACT_DEPLOYER_ADDRESS_BUG="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
CONTRACT_DEPLOYER_ADDRESS_PK_BUG="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
FROM_ADDRESS_BUG=$ADDRESS
FROM_ADDRESS_PK_BUG=""
CONTRACT_PATH_BUG="./abi/contracts/$CONTRACT_NAME_BUG.sol/$CONTRACT_NAME_BUG.json"

if [ $i = 1 ]; then
   STOP=". /hardhat/nothing.sh"
   START=". /hardhat/nothing.sh"
elif [$i = $MAX_QTD_STUDENTS * $MAX_QTD_TEACHERS]; then
   START=". /hardhat/nothing.sh"
   STOP=". /hardhat/stop.sh"
   echo "Last stopping"
fi


 workPath='benchmarks/scenario/AttendanceOrig/workload2.js';

 yq -Yi '.test.rounds[0].workload.module = '\""$workPath"\"''  benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml
 yq -Yi '.test.rounds[0].workload.module = '\""$workPath"\"''  benchmarks/scenario/$CONTRACT_NAME_BUG/config.yaml


sleep 1

jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_ORIG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_ORIG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_ORIG}"\"': {"path":'\""${CONTRACT_PATH_ORIG}"\"', "estimateGas": true, "gas": {"setReserveRoom": 500000, "setReleaseRoom": 500000, "setAddDaysToPay": 500000  }  } }    ' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json
jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_BUG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_BUG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_BUG}"\"': {"path":'\""${CONTRACT_PATH_BUG}"\"', "estimateGas": true, "gas": {"setReserveRoom": 500000, "setReleaseRoom": 500000, "setAddDaysToPay": 500000 }  }  }     ' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json


npx caliper launch manager \
    --caliper-bind-sut ethereum:1.3 \
    --caliper-workspace . \
    --caliper-benchconfig benchmarks/scenario/$CONTRACT_NAME_ORIG/config.yaml \
    --caliper-networkconfig /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json 



done


echo "Merging Files2"

cd output
csvstack ${merge_orig} ${merge_bug} > merged2.csv
csvstack ${merge_orig_b} ${merge_bug_b} > merged_b.csv
csvstack ${merge_orig_e} ${merge_bug_e} > merged_e.csv
csvstack ${merge_orig_i} ${merge_bug_i} > merged_i.csv
csvstack ${merge_orig_s} ${merge_bug_s} > merged_s.csv
csvstack ${merge_orig_f} ${merge_bug_f} > merged_f.csv
cd ..




