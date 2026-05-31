import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../Component/DataTable";
import { PencilIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";

type MemberPayment = {
    payment_id: number;
    promotion: string;
    price: number;
    old_end: string;
    new_end: string;
    payment_date: string;
};

const datetime_format = (date_time: string) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA") + " " + date.toLocaleTimeString();
};

export const FruitPaymentTable = (props: any) => {
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                //onClick={() => setOpenMember(true)}
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
            <DataTable columns={columns} data={props.fruit_payment.GetFruitPayment} />
        </>
    );
};

export default FruitPaymentTable;
