import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Model from "@/components/Model";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [show, setShow] = useState(false);
  const router = useRouter();
  //form details here..
  const [data, setData] = useState({
    toAddress: "",
    fromAddress: "",
    Amount: "",
    Token: "",
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const account = accounts[0];
        console.log("account", account);
        if (account) {
          await accountChangedHandler(account);
        }
      } catch (error) {
        setErrorMessage("Failed to connect wallet. Please try again.");
        console.error("Error connecting wallet:", error);
      }
    } else {
      setErrorMessage("Please Install Metamask!!!");
    }
  };

  const accountChangedHandler = async (newAccount) => {
    setDefaultAccount(newAccount);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(newAccount);
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    setUserBalance(ethers.utils.formatEther(balance));
    await getuserBalance(address);
  };

  const getuserBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
  };

  //tranfer token amount here...
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("runned", data);
    setShow(true);
    return;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleModel = () => {
    setShow(false);
  };

  return (
    <main>
      <Header connectWallet={connectWallet} defaultAccount={defaultAccount} />
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            for="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
          />
        </div>
        <div className="mb-5">
          <label
            for="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
          />
        </div>
        <div className="mb-5">
          <label
            for="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Amount
          </label>
          <input
            type="number"
            id="large-input"
            name="Amount"
            placeholder="Enter Amount"
            value={data.Amount}
            onChange={handleChange}
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <label
          for="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="countries"
          name="Token"
          value={data.Token}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option selected>Select Token</option>
          <option value="b4b">b4b</option>
          <option value="b4re">b4re</option>
          <option value="b4rc">b4rc</option>
          <option value="matic">matic</option>
        </select>
        <div>{errorMessage && errorMessage}</div>
        <div className="w-full flex items-center justify-center mt-4">
          <button
            type="submit"
            class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Transfer Token
          </button>
        </div>
      </form>

      {show && (
        <>
          <Model handleModel={handleModel} />
        </>
      )}
    </main>
  );
}
