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
  const [Address, setAddress] = useState("");
  const [userBalance, setUserBalance] = useState(null);
  const [show, setShow] = useState(false);
  const router = useRouter();
  //form details here..
  const [data, setData] = useState({
    toAddress: "",
    fromAddress: Address,
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
          setAddress(account);
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("runned", data);
    //transfer token logic here..
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-sepolia.g.alchemy.com/v2/50W0dopDqqG_hk-7jyz3EKN2cmdX5lGm"
      );
      // Create wallet using private key
      const privateKey =
        "e678e2a5c963a76b1b016bf053150cb88e6cc265bf49a37846f9f323764c3183";
      const wallet = new ethers.Wallet(privateKey, provider);
      // Load token contract
      const tokenContractAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        ["function transfer(address, uint256)"],
        wallet
      );
      // Transfer tokens
      // const recipientAddress = "0xd0Cc6653cF4d60f476CBF4d7b5D4fCDF1C6c9A4E";
      const recipientAddress = data.toAddress;
      // const gasLimit = await tokenContract.estimateGas.transfer(
      //   recipientAddress,
      //   "10"
      // );
      const gasLimit = 600000;
      // const increasedGasLimit = gasLimit.mul(110).div(100);
      const tx = await tokenContract.transfer(
        recipientAddress,
        // ethers.utils.parseUnits("10"),
        ethers.utils.parseUnits(data.Amount, "mwei"),
        { gasLimit }
      );
      console.log("tokenContract", tx);
      // Wait for transaction confirmation
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
      setShow(true);
    } catch (error) {
      console.log("error in transfering the token", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleModel = () => {
    setShow(false);
  };

  const getTokenAddress = async (walletAddress) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-sepolia.g.alchemy.com/v2/50W0dopDqqG_hk-7jyz3EKN2cmdX5lGm"
    );
    // Define the Transfer event signature
    const transferEvent = ethers.utils.id("Transfer(address,address,uint256)");

    // Get the filter to retrieve Transfer events for the wallet address
    const filter = {
      address: walletAddress,
      topics: [transferEvent, null, null], // The first topic is the Transfer event signature
    };

    // Get the logs matching the filter
    const logs = await provider.getLogs(filter);

    // Extract unique token addresses from the logs
    const tokenAddresses = new Set();
    for (const log of logs) {
      console.log("walletAddress", log);
      const tokenAddress = ethers.utils.getAddress(
        "0x" + log.topics[2].slice(-40)
      ); // Last topic contains the token address
      tokenAddresses.add(tokenAddress);
    }

    return [...tokenAddresses];
  };
  useEffect(() => {
    const fetchTokenAddresses = async () => {
      if (Address) {
        const addresses = await getTokenAddress(Address);
        console.log("addresses", addresses);
      }
    };

    fetchTokenAddresses();
  }, [Address]);

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
            value={Address}
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
