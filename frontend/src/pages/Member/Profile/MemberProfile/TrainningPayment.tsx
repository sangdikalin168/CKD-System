/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
// @ts-nocheck
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../Component/DataTable";
import { Button } from "@/components/ui/button";

type TrainningPayment = {
  payment_id: number;
  promotion: string;
  price: number;
  payment_date: string;
};

export const TrainningPayment = (props: any) => {
  const trainningPaymentcolumnHelper = createColumnHelper<TrainningPayment>();
  const trainningPaymencolumns = [
    trainningPaymentcolumnHelper.accessor((row) => row.payment_id, {
      id: "ID",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    trainningPaymentcolumnHelper.accessor((row) => row.payment_date, {
      id: "ថ្ងៃបង់ប្រាក់",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    trainningPaymentcolumnHelper.accessor((row) => row.promotion, {
      id: "Promotion",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    trainningPaymentcolumnHelper.accessor((row) => row.price, {
      id: "តម្លៃ",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    trainningPaymentcolumnHelper.accessor((row) => row.payment_id, {
      id: "Action",
      cell: (info) => (
        <div className="flex">
          {
            <>
              <span className="hidden sm:block">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  //onClick={() => { setShowProfile(showProfile); setCustomerID(info.row.original.customer_id) }}
                  onClick={() => setOpenMember(true)}
                >
                  <PencilIcon
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                </Button>
              </span>
            </>
          }
        </div>
      ),
      header: () => <span>Action</span>,
      footer: (info) => info.column.id,
    }),
  ];

  return (
    <>
      <DataTable
        columns={trainningPaymencolumns}
        data={props.trainning_payment}
      />
    </>
  );
};

export default TrainningPayment;
