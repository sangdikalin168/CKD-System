/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/ComponentToPrint";
import { v4 as uuidv4 } from "uuid";
import { useCreateTicketPaymentMutation } from "../../generated/graphql";

import { TypeOptions, toast } from "react-toastify";
const notify = (
  message: string,
  auto_Close: boolean | number,
  toastType: TypeOptions
) => {
  if (!toast.isActive("alert")) {
    toast(message, {
      autoClose: auto_Close ? 500 : false,
      toastId: "alert",
      type: toastType,
    });
  }
};

export default function Ticket() {
  const [uuid, setUuid] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLInputElement>(null);

  const handlePrint1 = async (target: HTMLIFrameElement) => {
    return new Promise(() => {
      console.log("forwarding print request to the main process...");
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.electronAPI.printComponent1(url, (response: any) => {
        console.log("Main: ", response);
      });
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: async (printIframe: HTMLIFrameElement) => {
      // Do whatever you want here, including asynchronous work
      await handlePrint1(printIframe);
    },
  });

  const handleGetQRCode = async (price: number) => {
    const unique_id = await uuidv4();
    const small_id = await unique_id.slice(0, 16);
    const result = await setUuid(small_id);
    buttonRef.current.click();
    await handleSubmit(price, small_id);
  };

  const [createTicketPayment] = useCreateTicketPaymentMutation();

  const handleSubmit = async (price: number, ticket_code: string) => {
    setIsLoading(true);
    const result = await createTicketPayment({
      variables: {
        userId: parseInt(localStorage.getItem("user_id")),
        price: price,
        ticketCode: ticket_code + "Ticket",
      },
    });

    if (result.data?.CreateTicketPayment.success) {
      notify("Success", true, "success");
      await timeout(700);
      setIsLoading(false);
      return;
    }

    notify(result.errors, 5000, "error");
  };

  const [isLoading, setIsLoading] = useState(false);

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  return (
    <div>
      <div className="h-full p-4 bg-gray-100 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-cyan-400">
          <h3 className="text-lg font-bold leading-6 text-white">លក់សំបុត្រ</h3>
        </div>
        <button
          className="hidden"
          ref={buttonRef}
          type="button"
          onClick={handlePrint}
        >
          Print
        </button>

        <div className="flex border-t border-gray-200">
          {ticket_list.map((list) => {
            return (
              <div
                key={list.price}
                className="relative bg-cyan-400 w-32 h-32 rounded-lg shadow m-2"
              >
                <span className="w-full h-full flex justify-center items-center text-5xl font-black">
                  <button
                    disabled={false}
                    className="w-full h-full"
                    onClick={() => handleGetQRCode(list.price)}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline mr-2 w-16 h-16 text-gray-200 animate-spin dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          ></path>
                        </svg>
                      </>
                    ) : (
                      <>{list.price}$</>
                    )}
                  </button>
                </span>
              </div>
            );
          })}
        </div>
        <div className="hidden">
          <ComponentToPrint
            ref={componentRef}
            price="1.5$"
            name="Chenda"
            uuid={uuid + "Ticket"}
          />
        </div>
      </div>
    </div>
  );
}

const ticket_list = [
  { price: 0 },
  { price: 1 },
  { price: 1.5 },
  { price: 2 },
  { price: 2.5 },
  { price: 3 },
  { price: 3.5 },
  { price: 4 },
  { price: 5 }
];
