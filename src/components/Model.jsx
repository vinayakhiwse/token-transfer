import React from "react";

function Model({ handleModel, transferToken, loading }) {
  return (
    <>
      {loading ? (
        <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-30 z-20">
          <div className="flex gap-1 justify-center bg-[#FFFFFF] dark:bg-[#FFFFFF]-800 rounded-lg shadow-3xl">
            <div className="flex flex-col gap-5 justify-center text-center p-20">
              <p className="text-center m-auto text-gray-500">
                 Please wait, your transaction is being processed...
              </p>

              <div >
                <div
                  aria-label="Loading..."
                  role="status"
                  className="flex items-center   space-x-2"
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
              </div>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </>
  )
}

export default Model;