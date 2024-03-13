import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Model from "@/components/Model";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    toAddress: "",
    fromAddress: "",
    fromAddressPrivateKey: "",
    Amount: "",
    Token: "",
  });

  let providerUrl =
    "https://clean-crimson-bridge.matic.quiknode.pro/367164a546a81efa760444831915fe02f9a067f8/";

  const tokenAddresses = {
    b4b: "0x993C211240a1987A46f1a2ba210e7f2499F2AF3a",
    b4re: "0x3c27564e3161bbaA6E7d2f0320fa4BE77AED54da",
    b4rc: "0x6be961cc7f0f182a58D1fa8052C5e92026CBEcAa",
    matic: "0x66735D689Dd1530410349Da0560354b80b88219b",
  };

  const handleAmount = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const walletLocal = new ethers.Wallet(
        data.fromAddressPrivateKey,
        provider
      );
      const localAddress = tokenAddresses[data.Token];
      const tokenContractBalance = new ethers.Contract(
        localAddress,
        ["function balanceOf(address) view returns (uint)"],
        walletLocal
      );

      if (localAddress === "0x66735D689Dd1530410349Da0560354b80b88219b") {
        const maticBalance = await provider.getBalance(data.fromAddress);
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
    setShow(true);
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
    const toAddress = data.toAddress;
    const fromAddress = data.fromAddress;
    const privateKey = data.fromAddressPrivateKey;
    const amount = data.Amount;

    try {
      setLoading(true);
      setShow(false);

      let providerUrl =
        "https://clean-crimson-bridge.matic.quiknode.pro/367164a546a81efa760444831915fe02f9a067f8/";
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const wallet = new ethers.Wallet(privateKey, provider);

      const tokenContractBalance = new ethers.Contract(
        tokenAddresses[data.Token],
        ["function balanceOf(address) view returns (uint)"],
        wallet
      );

      const getMaxAmount = await tokenContractBalance.balanceOf(fromAddress);
      let newBalance = getMaxAmount.toString();
      let parseBalance = ethers.utils.formatEther(newBalance);

      if (
        !ethers.utils.isAddress(toAddress) ||
        !ethers.utils.isAddress(fromAddress)
      ) {
        throw new Error("Invalid Ethereum address");
      }

      const tokenContract = new ethers.Contract(
        tokenAddresses[data.Token],
        ["function transfer(address, uint256)"],
        wallet
      );

      const transaction = await tokenContract.transfer(
        toAddress,
        ethers.utils.parseEther(amount)
      );
      await transaction.wait();
      console.log("after transaction hash---------", transaction.hash);
      toast.success("Token Transfer Sussessfully!");
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
      console.error("Token transfer error:", error);
      toast.error("Token Transfer Error");
      setShow(false);
    } finally {
      setLoading(false);
      setShow(false);
    }
  };

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
          {loading ? (
            <div
              aria-label="Loading..."
              role="status"
              className="flex items-center space-x-2"
            >
              <svg
                className="h-20 w-20 animate-spin stroke-gray-500"
                viewBox="0 0 256 256"
              >
                <line
                  x1="128"
                  y1="32"
                  x2="128"
                  y2="64"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></line>
                <line
                  x1="195.9"
                  y1="60.1"
                  x2="173.3"
                  y2="82.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></line>
                <line
                  x1="224"
                  y1="128"
                  x2="192"
                  y2="128"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="195.9"
                  y1="195.9"
                  x2="173.3"
                  y2="173.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="128"
                  y1="224"
                  x2="128"
                  y2="192"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="60.1"
                  y1="195.9"
                  x2="82.7"
                  y2="173.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="32"
                  y1="128"
                  x2="64"
                  y2="128"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="60.1"
                  y1="60.1"
                  x2="82.7"
                  y2="82.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="24"
                ></line>
              </svg>
              <span className="text-4xl font-medium text-gray-500">
                Loading...
              </span>
            </div>
          ) : (
            <button
              // type="submit"
              onClick={handleSubmit}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Transfer Token
            </button>
          )}
        </div>
      </div>
      {/*</form>*/}

      {show && (
        <>
          <Model handleModel={handleModel} transferToken={transferToken} />
        </>
      )}
    </main>
  );
}
