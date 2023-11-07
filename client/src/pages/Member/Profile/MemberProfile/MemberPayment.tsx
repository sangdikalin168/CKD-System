import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../Component/DataTable";
import { PrinterIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { MemberInvoice } from "../../../../components/ComponentToPrint/MemberInvoice";
import { useMemberPaymentDetailLazyQuery } from "../../../../generated/graphql";
import { useReactToPrint } from "react-to-print";

type MemberPayment = {
  payment_id: number;
  promotion: string;
  price: number;
  old_end: string;
  new_end: string;
  payment_date: string;
  shift: string;
};

const datetime_format = (date_time: string) => {
  const date = new Date(date_time);
  return date.toLocaleDateString("fr-CA") + " " + date.toLocaleTimeString();
};

const date_format = (date_time: Date) => {
  const date = new Date(date_time);
  return date.toLocaleDateString("fr-CA");
};

export const MemberPayment = (props: any) => {
  const columnHelper = createColumnHelper<MemberPayment>();
  const columns = [
    columnHelper.accessor((row) => row.payment_id, {
      id: "ID",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.payment_date, {
      id: "ថ្ងៃបង់ប្រាក់",
      cell: (info) => datetime_format(info.getValue()),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.promotion, {
      id: "Promotion",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.price, {
      id: "តម្លៃ",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.old_end, {
      id: "Old",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.new_end, {
      id: "New",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.payment_id, {
      id: "Action",
      cell: (info) => (
        <div className="flex">
          {
            <>
              <span className="hidden sm:block">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => PaymentDetail(info.row.original.payment_id)}
                >
                  <PrinterIcon
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                </button>
              </span>
            </>
          }
        </div>
      ),
      header: () => <span>Action</span>,
      footer: (info) => info.column.id,
    }),
  ];

  const [getPaymentDetail] = useMemberPaymentDetailLazyQuery({ fetchPolicy: "no-cache" });
  const [detail, setDetail] = useState();

  const PaymentDetail = async (payment_id: number) => {
    const result = await getPaymentDetail({
      variables: {
        paymentId: payment_id
      }
    })

    if (result.data) {
      setDetail(result.data.MemberPaymentDetail);
    }
  }

  const sendToElectron = async (target: HTMLIFrameElement) => {
    return new Promise(() => {
      console.log("forwarding print request to the main process...");
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.electronAPI.printComponent(url, (response: any) => {
        console.log("Main: ", response);
      });
      // console.log('Main: ', data);
    });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: async (printIframe: HTMLIFrameElement) => {
      // Do whatever you want here, including asynchronous work
      await sendToElectron(printIframe);
    },
  });

  const componentRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // This function will be called after the component re-renders
    if (detail) {
      handlePrint();
    }
  }, [detail]);

  return (
    <>
      <DataTable columns={columns} data={props.member_payment} />
      {
        detail ? (
          <div className="hidden">
            <MemberInvoice
              ref={componentRef}
              invoice_id={detail.payment_id}
              payment_date={datetime_format(detail.payment_date)}
              cashier={detail.display_name}
              c_name={detail.customer_name}
              phone={detail.phone}
              promotion={detail.promotion}
              price={detail.price}
              old_end={date_format(detail.old_end)}
              new_end={date_format(detail.new_end)}
              shift={"Full"}
            />
          </div>
        ) : null
      }

    </>
  );
};

export default MemberPayment;
