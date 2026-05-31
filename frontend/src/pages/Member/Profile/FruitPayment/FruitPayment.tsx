import { CurrencyDollarIcon } from "@heroicons/react/20/solid";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import DataTable from "../../Component/DataTable";
import {
    useCreateFruitPaymentMutation,
    useGetFruitPriceTableQuery
} from "../../../../generated/graphql";

import { TypeOptions, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { MemberInvoice } from "../../../../components/ComponentToPrint/MemberInvoice";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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

type PriceTable = {
    id: number;
    name: string;
    age: string;
    member_type: string;
    month_qty: number;
    price: number;
};
const datetime_format = (date_time: Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA") + " " + date.toLocaleTimeString();
};

const date_format = (date_time: Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
};

export const FruitPayment = (props) => {
    const columnHelperPriceTable = createColumnHelper<PriceTable>();
    const columns_price_table = [
        columnHelperPriceTable.accessor((row) => row.name, {
            id: "ឈ្មោះ Promotion",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelperPriceTable.accessor((row) => row.age, {
            id: "វ័យ",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelperPriceTable.accessor((row) => row.month_qty, {
            id: "ចំនួនខែ",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),

        columnHelperPriceTable.accessor((row) => row.price, {
            id: "តម្លៃ",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelperPriceTable.accessor((row) => row.id, {
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
                                    onClick={() => {
                                        setIsShowConfirmModal(true);
                                        const row = info.row.original;
                                        setMonthQty(row.month_qty);
                                        setPromotion(row.name);
                                        setPrice(row.price);
                                        setShift(row.shift);
                                    }}
                                >
                                    <CurrencyDollarIcon
                                        className="h-4 w-4 text-green-500"
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

    const { data: price_table, loading } = useGetFruitPriceTableQuery({
        fetchPolicy: "no-cache",
    });

    const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
    const [member_price_table, setMemberPriceTable] = useState([]);

    const FilterPriceTableByMonth = (month_qty: number) => {
        const result = price_table?.GetFruitPriceTable.filter(
            (p) => p.month_qty == month_qty
        );
        setMemberPriceTable(result);
    };

    const [month_qty, setMonthQty] = useState(1);
    const [shift, setShift] = useState("");
    const [price, setPrice] = useState(0);
    const [promotion, setPromotion] = useState("");

    useEffect(() => {
        if (price_table?.GetFruitPriceTable.length !== 0) {
            FilterPriceTableByMonth(1);
        }
    }, [price_table])

    return (
        <Dialog
            open={props.open}
            onOpenChange={(open) => {
                if (!open) {
                    props.setOpenFruit(false);
                    setIsShowConfirmModal(false);
                }
            }}
        >
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>តារាងតម្លៃ</DialogTitle>
                </DialogHeader>

                <div className="mt-2">
                    {!isShowConfirmModal ? (
                        <>
                            <div className="space-x-2 mb-3">
                                <Button
                                    type="button"
                                    onClick={() => FilterPriceTableByMonth(1)}
                                >
                                    1ខែ
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => FilterPriceTableByMonth(3)}
                                >
                                    3ខែ
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => FilterPriceTableByMonth(6)}
                                >
                                    6ខែ
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => FilterPriceTableByMonth(12)}
                                >
                                    12ខែ
                                </Button>
                            </div>
                            {!loading ? (
                                <DataTable
                                    columns={columns_price_table}
                                    data={member_price_table}
                                />
                            ) : (
                                <div>Loading...</div>
                            )}
                        </>
                    ) : (
                        <ConfirmModal
                            setIsShowConfirmModal={setIsShowConfirmModal}
                            old_end={props.details?.end_fruit_date}
                            month_qty={month_qty}
                            promotion={promotion}
                            shift={shift}
                            price={price}
                            customer_id={props.details?.customer_id}
                            user_id={parseInt(
                                localStorage.getItem("user_id")
                            )}
                            customer_name={props.details?.customer_name}
                            phone={props.details?.phone}
                            refetchMemberDetail={props.refetchMemberDetail}
                            refetch={props.refechFruitPayment}
                            setOpen={props.setOpen}
                        />
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            props.setOpenFruit(false);
                            setIsShowConfirmModal(false);
                        }}
                    >
                        បោះបង់
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ConfirmModal = (props: any) => {
    const getRenewalDate = (effectiveDate: Date, month_qty: number) => {
        // Get the current date.
        const today = new Date();
        let duration = 0;
        if (effectiveDate < today) {
            duration = today.getMonth() - today.getMonth() + month_qty;
            // Add the duration to the effective date to get the next renewal date.
            const renewalDate = new Date(today);
            renewalDate.setMonth(renewalDate.getMonth() + duration);
            //renewalDate.setFullYear(renewalDate.getFullYear() + duration / 12);
            return renewalDate;
        } else {
            duration = today.getMonth() - effectiveDate.getMonth() + month_qty;
            // Add the duration to the effective date to get the next renewal date.
            const renewalDate = new Date(effectiveDate);
            renewalDate.setMonth(renewalDate.getMonth() + month_qty);
            //renewalDate.setFullYear(renewalDate.getFullYear() + month_qty / 12);
            return renewalDate;
        }
    };

    const effectiveDate = new Date(props.old_end);
    const renewalDate = getRenewalDate(effectiveDate, props.month_qty);
    const [createMemberFruit] = useCreateFruitPaymentMutation();

    const [payment_id, setPaymentID] = useState(0);

    const handleSubmit = async () => {
        const result = await createMemberFruit({
            variables: {
                monthQty: props.month_qty,
                newEnd: date_format(renewalDate),
                oldEnd: props.old_end,
                price: props.price,
                promotion: props.promotion,
                customerId: props.customer_id,
                userId: props.user_id,
            },
        });

        if (result.data?.CreateFruitPayment.success) {
            setPaymentID(result.data.CreateFruitPayment.payment_id);
            notify("Success", true, "success");
            props.refetch();
            props.refetchMemberDetail();
            props.setOpen(false);
            return;
        }
        notify("Failed", true, "error");
    };

    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint1 = async (target: HTMLIFrameElement) => {
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
            await handlePrint1(printIframe);
        },
    });
    const buttonRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // This function will be called after the component re-renders
        if (payment_id > 0) {
            buttonRef.current.click();
            props.setIsShowConfirmModal(false);
        }
    }, [payment_id]);

    return (
        <>
            <button
                className="hidden"
                ref={buttonRef}
                type="button"
                onClick={handlePrint}
            >
                Print
            </button>
            <p className="text-lg font-semibold leading-6 text-gray-900">
                សុពលភាពចាស់: {props.old_end}
            </p>
            <p className="text-lg font-semibold leading-6 text-gray-900 mb-2 ">
                ថ្ងៃបង់ប្រាក់បន្ទាប់: {date_format(renewalDate)}
            </p>
            <div className="flex gap-2 justify-end">
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => props.setIsShowConfirmModal(false)}
                >
                    បោះបង់
                </Button>
                <Button
                    type="button"
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleSubmit}
                >
                    យល់ព្រម
                </Button>
            </div>

            <div className="hidden1">
                <MemberInvoice
                    ref={componentRef}
                    invoice_id={payment_id}
                    payment_date={datetime_format(new Date())}
                    cashier={localStorage.getItem("display_name")}
                    c_name={props.customer_name}
                    phone={props.phone}
                    promotion={props.promotion}
                    price={props.price}
                    old_end={props.old_end}
                    new_end={date_format(renewalDate)}
                    shift={""}
                />
            </div>
        </>
    );
};
