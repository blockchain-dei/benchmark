
# 📊 bBench Setup & Benchmark Execution

This guide outlines the steps to configure a benchmarking environment using **Hardhat** and **Hyperledger Caliper**, based on the **bBench** project.

---

## ✅ Requirements

- One **contract per file**
- The **contract name** must match the name of the contract defined in the Solidity code

---

## ⚙️ Installation and Component Structure

### 📁 Hardhat Component

This component simulates a local Ethereum network where the benchmark will be executed.

1. Download the Hardhat folder from the `bBench` repository.

   ```bash
   /hardhat
   ```

---

### 📁 Caliper Component

This component runs the tests and generates performance metrics based on the smart contracts.

1. Download the Caliper folder from the `bBench` repository.

   ```bash
   /caliper
   ```

---

## 📥 Step 1 — Prepare the Input Folder

Copy the contract(s) to be tested into:

```bash
/hardhat/contracts
```

---

## ⚙️ Step 2 — Generate ABI Code

Compile the contracts with Hardhat to generate ABI files:

```bash
cd hardhat
. compile.sh contract_file.sol
```

---

## 📁 Step 3 — Set Up the Scenario

1. Edit the function parameters file:

   ```bash
   /caliper/workloadGen/functionParameters.json
   ```

2. Run the scenario creation script:

Usage: createParam.sh MaxRound NumberOfWorkers RampUp(min) MeasurementTime(min) RampDown(min) NumberOfTps

```bash
cd /caliper/ethereum
. createScenario.sh 10 5 2 10 2 200
```

---

## 🚀 Step 4 — Run the Benchmark

With everything set up, run the benchmark tests:

1. Run the bBench!!

Usage: startC.sh ContractName

```bash
cd /caliper/ethereum
. startC.sh contract_file
```

---

## 📈 Step 5 — Analyze the All Merged Output Files

```bash
/caliper/ethereum/output
```

---

## (Optional) 🐘 Step 6 — Insert the CSV Files into PostgreSQL DataBase

Run `DDL.sql` Create the tables using this file.

Run `EDA.sql` to visualize and analyze the results.

---

## 🧪 Final Notes

- Make sure all file paths are correct and required configuration files are present.

---
