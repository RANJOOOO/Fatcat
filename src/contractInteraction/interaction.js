import Web3 from "web3";
import marketplacejson from "../abis/wrappedflare.json";
import wrappedsgb from "../abis/wrappedsgb.json";
//=================================================================================//
const RPC_URL = process.env.REACT_APP_RPC_URL;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const wsgbaddress = process.env.REACT_APP_WSGB_CONTRACT_ADDRESS;
console.log("contract addreess", wsgbaddress);
const web3 = new Web3(RPC_URL);
const web3wsgb = new Web3(process.env.REACT_APP_RPC_URL_WSGB);
const contract = new web3.eth.Contract(marketplacejson, contractAddress);
const wsgbcontract = new web3wsgb.eth.Contract(wrappedsgb, wsgbaddress);

//=================================================================================//

export const checkBalance = async (address) => {
  const data = await contract.methods.balanceOf(address).call();
  const finaldata = data.toString();
  return finaldata;
};
export const checkWSgbBalance = async (address) => {
  const wsgbbalance = await wsgbcontract.methods.balanceOf(address).call();
  return wsgbbalance.toString();
};
// export const BuySell = () => {
//   let transaction = {
//     to: marketplaceContractAddress,
//     chainId: CHAIN_ID,
//     data: marketplace_contract.methods
//       .buyNft(weiValue, prod.tokenId)
//       .encodeABI(),
//     value: weiValue,
//   };
//   signer
//     .sendTransaction(transaction)
//     .then(async (hash) => {
//       for (let index = 0; index > -1; index++) {
//         var receipt = await web3.eth.getTransactionReceipt(hash);
//         if (receipt != null) {
//           toast("NFT Buy successfully");
//           setShow(false);
//           getListedNftss();
//           // const docRef = await addDoc(collection(firestoredb, "BuyHistory"), {
//           //     transactionHash: hash,
//           //     timeStamp: new Date().getTime(),
//           // });
//           break;
//         }
//       }
//     })
//     .catch((error) => {
//       setisLoading(false);
//       console.log(error.code);
//       if (error.code == 4001) {
//         toast.warning("Transaction Rejected!", {
//           toastId: "buyError",
//         });
//       } else {
//         toast.error("Something went wrong while Buying", {
//           toastId: "ListError",
//         });
//       }
//     });
// };
