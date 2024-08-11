
#////////////////////////////////////////////////
#///////##////////// DAPP's ##///////////////////
#////////////////////////////////////////////////
# left blank for no debug
dAppsDebug="EHRBlockchain"


dAppsArray=("RentRoom" "Attendance" "EHRBlockchain")
count=1
countApp=1


rm /caliper/ethereum/output/*.csv -f
rm /caliper/ethereum/output/*.html -f

for i in "${dAppsArray[@]}"
do
    
     count=1
     echo $i
    
     jq -c '.[]'  gasParam.json | while read ParamGas; do
        if [ $countApp = $count ]; then 
             echo "Running dApp -> $i ....  "$ParamGas""
             #echo $i
             #echo $dAppsDebug
              if [ $dAppsDebug = $i ]; then
                ./runDapps.sh $i $ParamGas
              elif [ $dAppsDebug = "" ]; then

                ./runDapps.sh $i $ParamGas
              fi
        fi
          let count++;
      done
 

 let countApp++

done


