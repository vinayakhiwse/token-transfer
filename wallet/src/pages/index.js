import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Model from "@/components/Model";
import Header from "@/components/Header";
import { toast } from "react-toastify";
// import ABI from "./abi/sepoliatoken.json";
// import ABI from "./abi/bnbtoken.json";
// import ABI from "./abi/polygontoken.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // console.log("ABI: ",ABI);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [data, setData] = useState({
    toAddress: "",
    fromAddress: "",
    fromAddressPrivateKey: "",
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
    console.log("Form data------", data);
    setShow(true);
    return;
  };

  const tokenAddresses = {
    b4b: {
      address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
      rpcUrl:
        "https://eth-sepolia.g.alchemy.com/v2/50W0dopDqqG_hk-7jyz3EKN2cmdX5lGm",
    },
    b4re: {
      address: "0xB41eEF0479A7738Ff2081E5093D27C46B99a3f0f",
      rpcUrl:
        "https://cold-dry-dinghy.bsc-testnet.quiknode.pro/c441a412e8ea270ed3810b2a1970193f05992a49/",
    },
    b4rc: {
      address: "0x52D800ca262522580CeBAD275395ca6e7598C014",
      rpcUrl:
        "https://polygon-mumbai.g.alchemy.com/v2/yXUomCqFj5CkVZCa6fn6KoZSJnJIlBX5",
    },
    matic: {
      address: "0xA0BAfe3Fbb65D440f33248d243Ed21628655406C",
      rpcUrl:
        "https://eth-sepolia.g.alchemy.com/v2/50W0dopDqqG_hk-7jyz3EKN2cmdX5lGm",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));

    if (tokenAddresses[value]) {
      const { address, rpcUrl } = tokenAddresses[value];
      setData((prevData) => ({
        ...prevData,
        TOKEN_CONTRACT_ADDRESS: address,
        RPC_URL: rpcUrl,
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
    console.log("Form data in transfer token function------", data);
    const token = data.Token;
    const toAddress = data.toAddress;
    const fromAddress = data.fromAddress;
    const privateKey = data.fromAddressPrivateKey;
    const amount = data.Amount;
    // const TOKEN_CONTRACT_ADDRESS = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"; //dai sepolia
    // const TOKEN_CONTRACT_ADDRESS = "0xB41eEF0479A7738Ff2081E5093D27C46B99a3f0f";   //tvex bsc
    // const TOKEN_CONTRACT_ADDRESS = "0x52D800ca262522580CeBAD275395ca6e7598C014"; //usdc polygon
    // const GAS_LIMIT = 600000;
    const TOKEN_CONTRACT_ADDRESS = data.TOKEN_CONTRACT_ADDRESS;
    console.log("token Address-------", data.TOKEN_CONTRACT_ADDRESS);
    console.log("rpc---------", data.RPC_URL);
    try {
      setLoading(true);
      // const providerUrl =
      //   "https://eth-sepolia.g.alchemy.com/v2/50W0dopDqqG_hk-7jyz3EKN2cmdX5lGm";
      // const providerUrl =
      // "https://cold-dry-dinghy.bsc-testnet.quiknode.pro/c441a412e8ea270ed3810b2a1970193f05992a49/";
      // const providerUrl =
      //   "https://polygon-mumbai.g.alchemy.com/v2/yXUomCqFj5CkVZCa6fn6KoZSJnJIlBX5";

      const providerUrl = data.RPC_URL;
      const provider = new ethers.providers.JsonRpcProvider(providerUrl);
      const wallet = new ethers.Wallet(privateKey, provider);

      if (
        !ethers.utils.isAddress(toAddress) ||
        !ethers.utils.isAddress(fromAddress)
      ) {
        throw new Error("Invalid Ethereum address");
      }

      const tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        // ABI,
        ["function transfer(address, uint256)"],
        wallet
      );

      // const balance = await tokenContract.balanceOf(fromAddress);
      // console.log("Token balance:", ethers.utils.formatEther(balance));

      const transaction = await tokenContract.transfer(
        toAddress,
        ethers.utils.parseEther(amount)
        // {
        //   gasLimit: GAS_LIMIT,
        // }
      );
      await transaction.wait();
      console.log("Token transfer successful!");
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
    }
  };

  return (
    <main>
      <Header connectWallet={connectWallet} defaultAccount={defaultAccount} />
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="large-input"
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
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="large-input"
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
            required
          />
        </div>
        <label
          htmlFor="tokenoption"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="tokenoption"
          name="Token"
          value={data.Token}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        >
          <option defaultValue="Select Token">Select Token</option>
          <option value="b4b">b4b</option>
          <option value="b4re">b4re</option>
          <option value="b4rc">b4rc</option>
          <option value="matic">matic</option>
        </select>
        <div>{errorMessage && errorMessage}</div>
        <div className="w-full flex items-center justify-center mt-4">
          {/* <button
            type="submit"
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Transfer Token
          </button> */}
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="195.9"
                  y1="60.1"
                  x2="173.3"
                  y2="82.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="224"
                  y1="128"
                  x2="192"
                  y2="128"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="195.9"
                  y1="195.9"
                  x2="173.3"
                  y2="173.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="128"
                  y1="224"
                  x2="128"
                  y2="192"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="60.1"
                  y1="195.9"
                  x2="82.7"
                  y2="173.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="32"
                  y1="128"
                  x2="64"
                  y2="128"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
                <line
                  x1="60.1"
                  y1="60.1"
                  x2="82.7"
                  y2="82.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
              </svg>
              <span className="text-4xl font-medium text-gray-500">Loading...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Transfer Token
            </button>
          )}
        </div>
      </form>
      {/* <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
              <CircularProgress color="primary" />
            </div> */}

      {show && (
        <>
          <Model handleModel={handleModel} transferToken={transferToken} />
        </>
      )}
    </main>
  );
}
