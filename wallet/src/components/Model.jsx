import React from "react";

function Model({ handleModel , transferToken}) {
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
