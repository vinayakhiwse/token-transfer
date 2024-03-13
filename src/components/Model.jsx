import React from "react";

function Model({ handleModel, transferToken }) {
  return (
    <>
      <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-30 z-20">
        <div className="flex gap-1 justify-center bg-[#FFFFFF] dark:bg-[#FFFFFF]-800 rounded-lg shadow-3xl">
          <div className="flex flex-col gap-5 justify-center text-center p-8">
            <p className="text-center m-auto text-gray-500">
              Would you like to transfer the token amount?
            </p>

            <div className="w-full flex justify-between">
              <button
                onClick={handleModel}
                className=" bg-gray-200 py-3 px-10 rounded-sm text-sm hover:bg-gray-100"
              >
                Reject
              </button>{" "}
              <button
                // onClick={handleModel}
                onClick={() => {
                  transferToken();
                }}
                className=" bg-gray-200 py-3 px-10 rounded-sm text-sm hover:bg-gray-100"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Model;

{
  /* <div className="mb-5">
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
        </div> */
}
{
  /* <label
htmlFor="tokenoption"
className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
>
Select an option
</label> */
}
{
  /*       
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
        </select> */
}
