import React from "react";

function Header({ connectWallet, defaultAccount }) {
  return (
    <>
      <div className="w-full flex justify-end pr-8 pt-4">
        <button
          type="button"
          onClick={connectWallet}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {defaultAccount ? "Connected!!" : "Connect Wallet"}
        </button>
      </div>
    </>
  );
}

export default Header;
