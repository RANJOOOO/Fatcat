import { ContractFactory, ethers } from "ethers";
import { toast } from "react-toastify";
import Web3 from "web3";
// import mintContractABI from "../abis/erc721.json";
// import mintContractByteCode from "../abis/mint_contract_bytecode.json";
// import mintContractABI from "../abis/NewERC721ABI.json";
// import mintContractByteCode from "../abis/Newbytecode.json";
import mintContractABI from "../abis/SafeMint/v2/abi.json";
import mintContractByteCode from "../abis/SafeMint/v2/bytecode.json";

// export default async function createContractss(address) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Configuring the connection to an BSC Testnet node
//       console.log(process.env.REACT_APP_RPC_URL_FLARE);
//       const web3 = new Web3(process.env.REACT_APP_RPC_URL_FLARE);
//       // Creating a signing account from a private key

//       // const signer = web3.eth.accounts.privateKeyToAccount(
//       //   process.env.REACT_APP_PRIVATE_KEY
//       // );

//       // web3.eth.accounts.wallet.add(signer);

//       // Using the signing account to deploy the contract
//       const contract = new web3.eth.Contract(mintContractABI);
//       contract.options.data = mintContractByteCode[0].bytecode;

//       // const adminAddress = import.meta.env.VITE_ADMIN_ADDRESS;
//       // const tokenAddress = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;

//       // Arguments for the constructor
//       const constructorArgs = []; // Provide your constructor arguments here
//       console.log(contract);
//       const deployTx = contract.deploy({
//         arguments: constructorArgs,
//       });
//       console.log(deployTx);
//       // console.log(signer.address);
//       console.log("Gas Limit~~~~~~");
//       console.log(await deployTx.estimateGas());
//       const deployedContract = await deployTx
//         .send({
//           from: address,
//           gas: (await deployTx.estimateGas()) + 25000,
//         })
//         .once("transactionHash", async (txhash) => {
//           console.log(`Mining deployment transaction ...`);
//           const explorerUrl = "https://coston2-explorer.flare.network";
//           console.log(`${explorerUrl}/tx/${txhash}`);
//           for (let index = 0; index > -1; index++) {
//             var receipt = await web3.eth.getTransactionReceipt(txhash);
//             if (receipt != null) {
//               if (receipt.status == true) {
//                 resolve({
//                   success: true,
//                   contractAddress: receipt.contractAddress,
//                   hash: txhash,
//                 });
//                 break;
//               } else {
//                 reject({ success: false });
//                 break;
//               }
//             }
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//           reject({ success: false });
//         });
//       // The contract is now deployed on chain!
//       console.log(`Contract deployed at ${deployedContract.options.address}`);
//       console.log(
//         `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`
//       );
//     } catch (err) {
//       console.log(err);
//       reject({ success: false });
//       // reject({ success: false })
//     }
//   });
// }

export default async function CreateContract(signer) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SIGNER", signer);
      const userAddress = signer.account.address;

      console.log("User Address", userAddress); // User's address

      const web3 = new Web3(window.ethereum);

      const contract = new web3.eth.Contract(mintContractABI);

      contract.options.data = mintContractByteCode[0].bytecode;

      const constructorArgs = [userAddress]; // Provide your constructor arguments here

      const deployTx = contract.deploy({
        arguments: constructorArgs,
      });

      const gasLimit = await deployTx.estimateGas();
      const gasPrice = await web3.eth.getGasPrice();
      const gasLimitWithBuffer = Math.round(gasLimit * 1.5); // You can adjust the buffer as needed

      console.log("Deplot Tx", deployTx);

      const deployedContract = await deployTx
        .send({
          from: userAddress,
          account: userAddress,
          gas: gasLimit + 25000,
        })
        .once("transactionHash", async (txhash) => {
          console.log(`Mining deployment transaction ...`);
          const explorerUrl = "https://coston2-explorer.flare.network";
          console.log(`${explorerUrl}/tx/${txhash}`);
          for (let index = 0; index > -1; index++) {
            var receipt = await web3.eth.getTransactionReceipt(txhash);
            if (receipt != null) {
              if (receipt.status == true) {
                resolve({
                  success: true,
                  contractAddress: receipt.contractAddress,
                  hash: txhash,
                });
                break;
              } else {
                reject({ success: false });
                break;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
          reject({ success: false });
        });
      //  The contract is now deployed on chain!
      console.log(`Contract deployed at ${deployedContract}`);
      console.log(`Contract deployed at ${deployedContract.options.address}`);
      console.log(
        `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`
      );
    } catch (err) {
      console.log(err);
      reject({ success: false });
      // reject({ success: false })
    }
  });
}

// const tx = await signer.sendTransaction({
//   to: userAddress, // Contract address
//   data: mintContractByteCode[0].bytecode,
//   gas: 250000,
// });

// console.log('TX', tx);

// // Using the user's address to deploy the contract
// const contract = new web3.eth.Contract(mintContractABI, tx.to);

// console.log('CONTRACT', contract);

// // Send the transaction
// const deployedContract = await web3.eth.sendTransaction(tx);

// console.log('Deployed Contract', deployedContract);

// console.log('Deployed Contract', deployedContract.contractAddress);

//   // Using the user's address to deploy the contract
//   const contract = new web3.eth.Contract(mintContractABI);

//   // Set the bytecode for the contract
//   contract.options.data = mintContractByteCode[0].bytecode;

//   // Arguments for the constructor
//   const constructorArgs = []; // Provide your constructor arguments here

//   // // Create the deployment transaction
//   const deployTx = contract.deploy({
//     arguments: constructorArgs,
//   });

//   // // Estimate gas and deploy the contract
//   // const gasLimit = await deployTx.estimateGas();
//   // const deployedContract = await deployTx.send({
//   //   from: userAddress,
//   //   gas: gasLimit + 25000,
//   // });

//   // console.log("Deployed Contract", deployedContract)

//   // Estimate gas
//   const gasLimit = await deployTx.estimateGas();

//   // Build the transaction object
//   const transactionObject = {
//     from: userAddress,
//     gas: gasLimit + 25000,
//     data: deployTx.encodeABI(),
//   };

//   console.log("transactionObject",transactionObject);

//   // Sign the transaction
//   // const signedMessage = await signer.signMessage(transactionObject);
//   // console.log(signedMessage);

//   // Send the signed transaction
//   // const transactionReceipt = await web3.eth.sendTransaction({ rawTransaction: signedMessage.raw });

//  // Sign the transaction
//  const signedTransaction = await signer.signTransaction(transactionObject);
//  console.log(signedTransaction);

//  // Send the signed transaction
//  const transactionReceipt = await web3.eth.sendTransaction(signedTransaction);

//   // // The contract is now deployed on chain!
//   // console.log(`Contract deployed at ${deployedContract.options.address}`);

//   // The contract is now deployed on chain!
//   console.log(`Contract deployed at ${transactionReceipt.contractAddress}`);
//       resolve({
//         success: true,
//         // contractAddress: deployedContract.options.address,
//         // contractAddress: transactionReceipt.contractAddress,
//       });
//     // } catch (err) {
//     //   console.error(err);
//     //   reject({ success: false, error: err.message });
//     // }
//   });
// }
