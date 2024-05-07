import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Model from "@/components/Model";
import { toast } from "react-toastify";
// import {log} from "next/dist/server/typescript/utils";
// import {console} from "next/dist/compiled/@edge-runtime/primitives";

// const inter = Inter({ subsets: ["latin"] });

let providerUrl ="https://polygon-mainnet.g.alchemy.com/v2/yyBP7xjYd6MmkC9fmFUBvsCE9_UNtwHy";
// "https://stylish-frosty-layer.matic.quiknode.pro/3e14897427dfe569ea2832de4ad363d6bd5cda00/";

const provider = new ethers.providers.JsonRpcProvider(providerUrl);

let wallet;

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Tx, setTx] = useState(
    "You got transaction hash upon successful transaction."
  );
  const [Error, setError] = useState("");

  const [data, setData] = useState({
    toAddress: "",
    fromAddress: "",
    fromAddressPrivateKey: "",
    Amount: "",
    Token: "",
  });

  // let providerUrl ="https://polygon-mainnet.g.alchemy.com/v2/yyBP7xjYd6MmkC9fmFUBvsCE9_UNtwHy";
    // "https://clean-crimson-bridge.matic.quiknode.pro/367164a546a81efa760444831915fe02f9a067f8/";

  const tokenAddresses = {
    b4b: "0x993C211240a1987A46f1a2ba210e7f2499F2AF3a",
    b4re: "0x3c27564e3161bbaA6E7d2f0320fa4BE77AED54da",
    b4rc: "0x6be961cc7f0f182a58D1fa8052C5e92026CBEcAa",
    matic: "0x66735D689Dd1530410349Da0560354b80b88219b",
  };

  const handleAmount = async () => {
    try {
      // const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const walletLocal = new ethers.Wallet(
        data.fromAddressPrivateKey,
        provider
      );
      const localAddress = tokenAddresses[data.Token];

      console.log(localAddress)

      const tokenContractBalance = new ethers.Contract(
        localAddress,
        ["function balanceOf(address) view returns (uint)"],
        walletLocal
      );

      if (localAddress === "0x66735D689Dd1530410349Da0560354b80b88219b") {
        const maticBalance = await provider.getBalance(data.fromAddress);

        console.log("balance is", maticBalance)
        console.log("balacne in string is", maticBalance.toString())
        // console.log("balacne in string is", ethers.utils.parseEther(maticBalance))

        return

        let formattedMatic = ethers.utils.formatEther(maticBalance.toString());
        setData({
          toAddress: data.toAddress,
          fromAddress: data.fromAddress,
          fromAddressPrivateKey: data.fromAddressPrivateKey,
          Amount: formattedMatic,
          Token: data.Token,
        });
      } else {
        const getMaxAmount = await tokenContractBalance.balanceOf(
          data.fromAddress
        );
        let newBalance = getMaxAmount.toString();
        let parseBalance = ethers.utils.formatEther(newBalance);
        let newAmount1 = Number(parseBalance);
        setData({
          toAddress: data.toAddress,
          fromAddress: data.fromAddress,
          fromAddressPrivateKey: data.fromAddressPrivateKey,
          Amount: newAmount1,
          Token: data.Token,
        });
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleSubmit = () => {
    if (
      data.toAddress &&
      data.fromAddress &&
      data.fromAddressPrivateKey &&
      data.Amount &&
      data.Token
    ) {
      setShow(true);
      return;
    }
    toast.error("Please Fill All The Details");
    return;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));

    if (tokenAddresses[value]) {
      setData((prevData) => ({
        ...prevData,
        TOKEN_CONTRACT_ADDRESS: tokenAddresses[value],
      }));
    }
  };

  const handleModel = () => {
    setShow(false);
    setData({
      toAddress: "",
      fromAddress: "",
      fromAddressPrivateKey: "",
      Amount: "",
      Token: "",
    });
  };

  const transferToken = async () => {

    // return

    const toAddress = data.toAddress;
    const fromAddress = data.fromAddress;
    const privateKey = data.fromAddressPrivateKey;
    let amount = data.Amount;

    wallet = new ethers.Wallet(privateKey, provider);
    console.log("called...........")
    // console.log("here")
    console.log("token is", data.Token)
    console.log("token is", tokenAddresses[data.Token])
    console.log(`amount is`, amount)

    try {
        if (data.Token === "matic") {
          setLoading(true)
          setShow(false);
          const maticBalance = await provider.getBalance(fromAddress)
          console.log(`Matic holdings are`, maticBalance)
          console.log(`toAddress is`, toAddress)

          // const amountToTransfer = ethers.utils.parseEther("0.000001"); // 1 MATIC

          const amountToTransfer = ethers.utils.parseEther(amount); // 1 MATIC
          console.log("token to transfer is:", amountToTransfer)

          // Calculate gas price
          const gasPrice = await provider.getGasPrice();
          console.log(`Current gas price:`, gasPrice.toString());
          console.log(`amount to transfer`, amountToTransfer)


          const tx = await wallet.sendTransaction({
            to: toAddress,
            value: amountToTransfer,
            gasPrice: gasPrice
          });

          await tx.wait()
          const receipt = await tx.wait();
          console.log("Transaction Receipt:", receipt);
          console.log("Transaction Hash:", tx.hash)
          console.log("MATIC transferred successfully")
          toast.success(` ${data.Token.toUpperCase()} transferred successfully`);


        } else {
          setLoading(true);
          setShow(false);

          console.log("Token is", data.Token)
          console.log("Token address is", tokenAddresses[data.Token])

          const tokenContractBalance = new ethers.Contract(
              tokenAddresses[data.Token],
              ["function balanceOf(address) view returns (uint)"],
              wallet
          );

          console.log(tokenAddresses[data.Token])
          console.log(tokenContractBalance)

          const getMaxAmount = await tokenContractBalance.balanceOf(fromAddress);
          let newBalance = getMaxAmount.toString();
          let parseBalance = ethers.utils.formatEther(newBalance);

          if (

              !ethers.utils.isAddress(toAddress) ||
              !ethers.utils.isAddress(fromAddress)
          ) {
            throw new Error("Invalid Ethereum address");
          }

          console.log("address ", tokenAddresses[data.Token])

          const tokenContract = new ethers.Contract(
              tokenAddresses[data.Token],
              ["function transfer(address, uint256)"],
              wallet
          );

          console.log("tokenContract", tokenContract)
          const nonce = await wallet.getTransactionCount("pending");

          console.log(`nonce`, nonce)

          console.log("before transaction")
          const gasPrice = await provider.getGasPrice();
          setLoading(true);

          const transaction = await tokenContract.transfer(
              toAddress,
              ethers.utils.parseEther(amount),
              // { gasPrice: gasPrice, nonce: nonce }
              {gasPrice: ethers.utils.parseUnits("1000", "gwei"), nonce: nonce}
          );

          console.log(transaction)

          console.log("after transaction")

          console.log(transaction);
          await transaction.wait();
          setTx(transaction.hash);
          console.log("Transaction hash", transaction.hash);
          toast.success(` ${data.Token.toUpperCase()} transferred successfully`);
        }
          setShow(false);
          setData({
            toAddress: "",
            fromAddress: "",
            fromAddressPrivateKey: "",
            Amount: "",
            Token: "",
          });
          setLoading(false);
    } catch (error) {
      console.log(`line no ${error.line}`)

      console.error("Token transfer error:", error.message);
      const cleaned_message = error?.message?.match(/[^({,]+/)[0];
      // setError(cleaned_message);
      toast.error(cleaned_message);
      setShow(false);
    } finally {
      setLoading(false);
      setShow(false);
    }
  };

  // console.log("This", Error);
  console.log("loading...................", loading)
  return (
    <main className="mt-24">
      <div className="max-w-sm mx-auto">
        <label
          htmlFor="Token"
          className="block mb-1 mt-3 ps-1 text-base font-medium text-gray-900"
        >
          Select an Token
        </label>
        <select
          id="Token"
          name="Token"
          value={data.Token}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option selected>Select Token</option>
          <option value="b4b">b4b</option>
          <option value="b4re">b4re</option>
          <option value="b4rc">b4rc</option>
          <option value="matic">matic</option>
        </select>
        <div className="mb-5">
          <label
            htmlFor="large-input"
            className="block mb-1 mt-3 ps-1 text-base font-medium text-gray-900"
          >
            From Address
          </label>
          <input
            type="text"
            id="large-input"
            name="fromAddress"
            placeholder="Enter From Address"
            value={data.fromAddress}
            onChange={handleChange}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="large-input"
            className="block mb-1 mt-3 ps-1 text-base font-medium text-gray-900"
          >
            From Address Private Key
          </label>
          <input
            type="text"
            id="large-input"
            name="fromAddressPrivateKey"
            placeholder="Enter From Address Private Key"
            value={data.fromAddressPrivateKey}
            onChange={handleChange}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="large-input"
            className="block mb-1 mt-3 ps-1 text-base font-medium text-gray-900"
          >
            To Address
          </label>
          <input
            type="text"
            id="large-input"
            name="toAddress"
            placeholder="Enter To Address"
            value={data.toAddress}
            onChange={handleChange}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <label
          htmlFor="search"
          className="block mb-1 mt-3 ps-1 text-base font-medium text-gray-900"
        >
          Enter Amount
        </label>
        <div className="relative">
          <input
            type="number"
            id="large-input"
            name="Amount"
            placeholder="Enter Amount"
            value={data.Amount}
            onChange={handleChange}
            className="block w-full p-4 ps-4 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <button
            type="button"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleAmount}
          >
            Max Token
          </button>
        </div>

        <div className="w-full flex items-center justify-center mt-4">
          <button
            // type="submit"
            onClick={handleSubmit}
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Transfer Token
          </button>
        </div>
      </div>
      {/* <div className="w-full flex items-center justify-center mt-4">
        <p>{Tx}</p>
      </div> */}

      {/*</form>*/}

      {show && (
        <Model
          handleModel={handleModel}
          transferToken={transferToken}
          loading={loading}
        />
      )}
      {loading && (
        <Model
          handleModel={handleModel}
          transferToken={transferToken}
          loading={loading}
        />
      )}
    </main>
  );
}
