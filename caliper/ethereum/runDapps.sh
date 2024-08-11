
#////////////////////////////////////////////////
#///////////////// PARAMETERS ///////////////////
#////////////////////////////////////////////////

MAX_ROUND=5
MAX_QTD_USERS=3
MAX_QTD_STUDENTS=2
MAX_QTD_TEACHERS=5
MAX_QTD_DOCTORS=3
MAX_QTD_PATIENTS=2


START=". /hardhat/start.sh"
STOP=". /hardhat/stop.sh"

cd /hardhat
ADDRESS=$(npx hardhat getRandomAccount)
#echo "$ADDRESS"
cd /caliper/ethereum

CONTRACT_BASE_NAME=$1
GAS_PARAM=$2

echo $GAS_PARAM

CONTRACT_NAME_ORIG=$CONTRACT_BASE_NAME"Orig"
CONTRACT_DEPLOYER_ADDRESS_ORIG="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
CONTRACT_DEPLOYER_ADDRESS_PK_ORIG="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
FROM_ADDRESS_ORIG=$ADDRESS
FROM_ADDRESS_PK_ORIG=""
CONTRACT_PATH_ORIG="./abi/contracts/$CONTRACT_NAME_ORIG.sol/$CONTRACT_NAME_ORIG.json"


CONTRACT_NAME_BUG=$CONTRACT_BASE_NAME"Bug"
CONTRACT_DEPLOYER_ADDRESS_BUG="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
CONTRACT_DEPLOYER_ADDRESS_PK_BUG="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
FROM_ADDRESS_BUG=$ADDRESS
FROM_ADDRESS_PK_BUG=""
CONTRACT_PATH_BUG="./abi/contracts/$CONTRACT_NAME_BUG.sol/$CONTRACT_NAME_BUG.json"



 WORKLOAD='benchmarks/scenario/'$CONTRACT_BASE_NAME'/workload.js';
 #echo $WORKLOAD
 yq -Yi '.test.rounds[0].workload.module = '\""$WORKLOAD"\"''  benchmarks/scenario/config.yaml


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

j=$((1 + RANDOM % $MAX_QTD_USERS)) 
k=$((1 + RANDOM % $MAX_QTD_TEACHERS))
u=$((1 + RANDOM % $MAX_QTD_STUDENTS)) 
p=$((1 + RANDOM % $MAX_QTD_PATIENTS))
d=$((1 + RANDOM % $MAX_QTD_DOCTORS)) 
r=$((180 + RANDOM % 365))

yq -Yi '.test.rounds[0].workload.arguments.RoundId = '$i''   benchmarks/scenario/config.yaml

yq -Yi '.test.rounds[0].workload.arguments.QtdUsers = '$j''   benchmarks/scenario/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdTeachers = '$u''   benchmarks/scenario/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdStudents = '$k''   benchmarks/scenario/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdDays = '$r''   benchmarks/scenario/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdPatients = '$p''   benchmarks/scenario/config.yaml
yq -Yi '.test.rounds[0].workload.arguments.QtdDoctors = '$d''   benchmarks/scenario/config.yaml



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

#echo "${merge_orig}"




jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_ORIG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_ORIG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_ORIG}"\"': {"path":'\""${CONTRACT_PATH_ORIG}"\"', "estimateGas": true, "gas":  '${GAS_PARAM}'  }}' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json
jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_BUG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_BUG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_BUG}"\"': {"path":'\""${CONTRACT_PATH_BUG}"\"', "estimateGas": true, "gas": '${GAS_PARAM}'   }}' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json

#jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_ORIG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_ORIG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_ORIG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_ORIG}"\"': {"path":'\""${CONTRACT_PATH_ORIG}"\"', "estimateGas": true, "gas": {"incrementAttendance": 500000, "addHistory": 500000, "getParticularStudent": 500000, "getStudents": 500000, "createTeacher": 500000, "createStudent": 500000 }  } }    ' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json
#jq '.caliper.command.start='\""${START}"\"'   | .caliper.command.end='\""${STOP}"\"' |  .ethereum.fromAddressPrivateKey='\""${FROM_ADDRESS_PK_BUG}"\"' |  .ethereum.fromAddress='\""${FROM_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddress='\""${CONTRACT_DEPLOYER_ADDRESS_BUG}"\"' | .ethereum.contractDeployerAddressPrivateKey='\""${CONTRACT_DEPLOYER_ADDRESS_PK_BUG}"\"' |  .ethereum.contracts += {'\""${CONTRACT_NAME_BUG}"\"': {"path":'\""${CONTRACT_PATH_BUG}"\"', "estimateGas": true, "gas": {"incrementAttendance": 500000, "addHistory": 500000, "getParticularStudent": 500000, "getStudents": 500000,"createTeacher": 500000, "createStudent": 500000  }  }  }     ' /caliper/ethereum/networks/networkconfig.json >  /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json



yq -Yi '.test.rounds[0].workload.arguments.ContractName = '\""$CONTRACT_NAME_ORIG"\"''   benchmarks/scenario/config.yaml

yq -Yi '.test.rounds[0].label = '\""${CONTRACT_BASE_NAME} #${i}"\"' '    benchmarks/scenario/config.yaml




sleep 1

npx caliper launch manager \
    --caliper-bind-sut ethereum:1.3 \
    --caliper-workspace . \
    --caliper-benchconfig benchmarks/scenario/config.yaml \
    --caliper-networkconfig /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_ORIG.json 

yq -Yi '.test.rounds[0].workload.arguments.ContractName = '\""$CONTRACT_NAME_BUG"\"''   benchmarks/scenario/config.yaml

npx caliper launch manager \
    --caliper-bind-sut ethereum:1.3 \
    --caliper-workspace . \
    --caliper-benchconfig benchmarks/scenario/config.yaml \
    --caliper-networkconfig /caliper/ethereum/networks/networkconfig_$CONTRACT_NAME_BUG.json
done

echo "Merging Files"


cd output
csvstack ${merge_orig} ${merge_bug} > merged_$CONTRACT_BASE_NAME.csv
csvstack ${merge_orig_b} ${merge_bug_b} > merged_b_$CONTRACT_BASE_NAME.csv
csvstack ${merge_orig_e} ${merge_bug_e} > merged_e_$CONTRACT_BASE_NAME.csv
csvstack ${merge_orig_i} ${merge_bug_i} > merged_i_$CONTRACT_BASE_NAME.csv
csvstack ${merge_orig_s} ${merge_bug_s} > merged_s_$CONTRACT_BASE_NAME.csv
csvstack ${merge_orig_f} ${merge_bug_f} > merged_f_$CONTRACT_BASE_NAME.csv
cd ..

