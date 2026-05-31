import LoadingPage from "../../../components/LoadingPage/LoadingPage"
import { useApproveHoldRequestMutation, useCheckHoldRequestMutation, useCreateHoldMutation, useGetCustomerDetailLazyQuery, useGetMemberPaymentLazyQuery, useHoldRequestsQuery } from "../../../generated/graphql";
import { CheckCircleIcon, PrinterIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import Notifications from "../../../components/Notification";
import { HoldInvoice } from "../../../components/ComponentToPrint/HoldInvoice";
import { useReactToPrint } from "react-to-print";
import DataTable from "../../../components/DataTable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


type HoldRequestType = {
    display_name: string
    request_id: number
    request_date: string
    reason: string
    from_date: string
    to_date: string
    old_end: string
    new_end: string
    customer_id: number
    customer_name: string
    phone: string
    checker_name: string
    checked_by: number
    checked_date: string
    checker_status: string
    checker_comment: string
    approved_name: string
    approved_by: number
    approved_date: string
    approver_comment: string
    approver_status: string
    process: string
    processed_by: number
    processed_name: string

}

const datetime_format = (date_time: string | Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA") + " " + date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
};

const date_format = (date_time: string) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
};


const HoldRequest = () => {

    const { data, loading, refetch } = useHoldRequestsQuery({ fetchPolicy: "no-cache" })

    const [checkerApprove] = useCheckHoldRequestMutation();
    const [approveHold] = useApproveHoldRequestMutation();


    const CheckApproverRole = async () => {
        //TODO: Check Permission
        const userRole = localStorage.getItem("role");
        if (userRole === "Admin") {
            setOpenApprove(true)
            return;
        }
        Notifications("អ្នកមិនមានសិទ្ធិទេ", "error")
    }

    const [getCustomer, { data: member }] = useGetCustomerDetailLazyQuery({ fetchPolicy: "no-cache" });
    const [getCustomerPayment, { data: payment }] = useGetMemberPaymentLazyQuery({ fetchPolicy: "no-cache" });
    const [createHold] = useCreateHoldMutation()

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)
    const [open_print, setOpenPrint] = useState(false)
    const [description, setDescription] = useState("")
    const [request_info, setRequestInfo] = useState({
        request_id: 0,
        customer_id: 0, customer_name: "Init Name", phone: "", end_membership_date: "", reason: "",
        from_date: "",
        to_date: "",
        new_end: "",
        checker_status: ""

    })

    const [open_approve, setOpenApprove] = useState(false)

    const [invoice_detail, setInvoiceDetail] = useState({
        invoice_id: 0,
        payment_date: "",
        cashier: "",
        customer_name: "",
        phone: "",
        start_date: "", end_date: "",
        old_end: "", new_end: ""
    })

    const HoldInvoiceRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    async function ProcessHold(): Promise<void> {
        const { data: { CreateHold: res } } = await createHold({
            variables: {
                newEnd: invoice_detail.new_end,
                customerId: request_info.customer_id,
                requestId: request_info.request_id,
                processedBy: parseInt(localStorage.getItem("user_id") || "99")
            }
        })

        if (res.success) {
            setInvoiceDetail({ ...invoice_detail, invoice_id: res.hold_id })
            return;
        }

        Notifications("បរាជ័យ", "error")
    }

    const handlePrint = useReactToPrint({
        content: () => HoldInvoiceRef.current,
        print: async (printIframe: HTMLIFrameElement) => {
            // Do whatever you want here, including asynchronous work
            await handlePrint1(printIframe);
        }
    });

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

    useEffect(() => {
        // This function will be called after the component re-renders
        if (invoice_detail.invoice_id > 0) {
            Notifications("ជោគជ័យ", "success")
            buttonRef.current.click();
            setOpenPrint(false);
            refetch()
        }
    }, [invoice_detail]);

    const columnHelper = createColumnHelper<HoldRequestType>();
    const columns = [
        columnHelper.accessor((row) => row.customer_name, {
            id: "អតិថិជន",
            cell: (info) => <div className="flex items-center"
                onClick={() => {
                    CheckApproverRole()
                    setRequestInfo({
                        request_id: info.row.original.request_id,
                        customer_id: info.row.original.customer_id,
                        customer_name: info.row.original.customer_name,
                        phone: info.row.original.phone,
                        end_membership_date: info.row.original.old_end,
                        reason: info.row.original.reason,
                        from_date: info.row.original.from_date,
                        to_date: info.row.original.to_date,
                        new_end: info.row.original.new_end,
                        checker_status: info.row.original.checker_status
                    })
                }}
            >
                <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 truncate">{info.row.original.customer_name}</a>
            </div>,
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.reason, {
            id: "មូលហេតុ",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.reason, {
            id: "ស្ថានភាព",
            cell: (info) => <>
                {
                    info.row.original.checker_status === "Approved" ?
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Approved</Badge>
                        :
                        <>
                            {
                                info.row.original.checker_status === "Rejected" ?
                                    <Badge variant="destructive" className="bg-rose-500/10 text-red-500">Rejected</Badge>
                                    :
                                    <Badge variant="outline" className="text-yellow-600">មានទាន់ពិនិត្យ</Badge>
                            }

                        </>

                }
            </>,
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.reason, {
            id: "Process",
            cell: (info) => <>
                {
                    info.row.original.checker_status === "Approved" ?
                        <>
                            {
                                info.row.original.process === "Pending" ?
                                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none" onClick={() => {
                                        setOpenPrint(true)
                                        setRequestInfo({ ...request_info, customer_id: info.row.original.customer_id, request_id: info.row.original.request_id })
                                        setInvoiceDetail({
                                            invoice_id: 0,
                                            payment_date: datetime_format(new Date()),
                                            cashier: localStorage.getItem("display_name"),
                                            customer_name: info.row.original.customer_name,
                                            phone: info.row.original.phone,
                                            start_date: date_format(info.row.original.from_date),
                                            end_date: date_format(info.row.original.to_date),
                                            old_end: date_format(info.row.original.old_end),
                                            new_end: date_format(info.row.original.new_end)
                                        })
                                    }}
                                    >
                                        <PrinterIcon
                                            className="h-4 w-4 text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    :
                                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                                        <CheckCircleIcon
                                            className="h-4 w-4 text-emerald-500"
                                            aria-hidden="true"
                                        />
                                    </span>

                            }

                        </>
                        :
                        <span className="inline-block p-1 rounded bg-emerald-500/10 text-yellow-500 font-medium text-[12px] leading-none">
                            <XCircleIcon
                                className="h-4 w-4 text-red-500"
                                aria-hidden="true"
                            />
                        </span>
                }
            </>,
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
    ];

    return (
        <>
            {!loading ? (
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <Card>
                        <CardContent className="p-2">
                        {/* <div className="flex items-center mb-4">
                            <button type="button" className=" bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">Pending</button>
                            <button type="button" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">Approved</button>
                            <button type="button" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">Rejected</button>
                            <button type="button" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tr-md rounded-br-md hover:text-gray-600">All</button>
                        </div> */}


                        <DataTable data={data?.HoldRequests} columns={columns} />
                        </CardContent>

                        {/* <div className="overflow-x-auto">
                            <table className="w-full min-w-[540px]">
                                <thead>
                                    <tr className="w-full">
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-200 text-left rounded-tl-md rounded-bl-md">ឈ្មោះអតិថិជន</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-200 text-left">មូលហេតុ</th>

                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-200 text-center">ស្ថានភាព</th>
                                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-200 text-center rounded-tr-md rounded-br-md">សកម្មភាព</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.HoldRequests.map((request) => {
                                            return (
                                                <tr key={request.request_id}>
                                                    <td className="py-2 px-2 border-b border-b-gray-50 w-10">
                                                        <div className="flex items-center"
                                                            onClick={() => {
                                                                CheckApproverRole()
                                                                setRequestInfo({
                                                                    request_id: request.request_id,
                                                                    customer_id: request.customer_id,
                                                                    customer_name: request.customer_name,
                                                                    phone: request.phone,
                                                                    end_membership_date: request.old_end,
                                                                    reason: request.reason,
                                                                    from_date: request.from_date,
                                                                    to_date: request.to_date,
                                                                    new_end: request.new_end,
                                                                    checker_status: request.checker_status
                                                                })
                                                            }}
                                                        >
                                                            <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">{request.customer_name}</a>
                                                        </div>
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-b-gray-50 text-left w-10">
                                                        <span className="text-[13px] font-medium text-black">{request.reason}</span>
                                                    </td>

                                                    <td className="py-2 px-4 border-b border-b-gray-50 text-center w-10" >
                                                        {
                                                            request.checker_status === "Approved" ?
                                                                <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                                                                    Approved
                                                                </span>
                                                                :
                                                                <>
                                                                    {
                                                                        request.checker_status === "Rejected" ?
                                                                            <span className="inline-block p-1 rounded bg-rose-500/10 text-red-500 font-medium text-[12px] leading-none">
                                                                                Rejected
                                                                            </span>
                                                                            :
                                                                            <span className="inline-block p-1 rounded bg-emerald-500/10 text-yellow-500 font-medium text-[12px] leading-none">
                                                                                មានទាន់ពិនិត្យ
                                                                            </span>
                                                                    }

                                                                </>

                                                        }
                                                    </td>
                                                    <td className="py-2 px-4 border-b border-b-gray-50 text-center w-4">
                                                        {
                                                            request.checker_status === "Approved" ?
                                                                <>
                                                                    {
                                                                        request.process === "Pending" ?
                                                                            <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none" onClick={() => {
                                                                                setOpenPrint(true)
                                                                                setInvoiceDetail({
                                                                                    invoice_id: 0,
                                                                                    payment_date: datetime_format(new Date()),
                                                                                    cashier: localStorage.getItem("display_name"),
                                                                                    customer_name: request.customer_name,
                                                                                    phone: request.phone,
                                                                                    start_date: date_format(request.from_date),
                                                                                    end_date: date_format(request.to_date),
                                                                                    old_end: date_format(request.old_end),
                                                                                    new_end: date_format(request.new_end)
                                                                                })
                                                                            }}
                                                                            >
                                                                                <PrinterIcon
                                                                                    className="h-4 w-4 text-gray-500"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                            :
                                                                            <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">
                                                                                <CheckCircleIcon
                                                                                    className="h-4 w-4 text-emerald-500"
                                                                                    aria-hidden="true"
                                                                                />
                                                                            </span>

                                                                    }

                                                                </>
                                                                :
                                                                <span className="inline-block p-1 rounded bg-emerald-500/10 text-yellow-500 font-medium text-[12px] leading-none">
                                                                    <XCircleIcon
                                                                        className="h-4 w-4 text-red-500"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div> */}
                    </Card>

                </div>
            ) : (
                <LoadingPage message={"Loading"} />
            )}

            <Button
                className="hidden"
                ref={buttonRef}
                type="button"
                onClick={handlePrint}
            >
                Print
            </Button>

            {/*Approve Or Reject */}
            <Dialog open={open_approve} onOpenChange={setOpenApprove}>
                <DialogContent className="sm:max-w-[350px] w-[350px]">
                    <DialogHeader>
                        <DialogTitle>សំណើសុំច្បាប់</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="w-full space-y-1">
                            <Label>ឈ្មោះអតិថិជន</Label>
                            <Input
                                type="text"
                                readOnly
                                disabled
                                value={request_info.customer_name}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="col-span-1 space-y-1">
                                <Label>លេខទូរស័ព្ទ</Label>
                                <Input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={request_info.phone}
                                />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <Label>ថ្ងៃផុតសពលភាពចាស់</Label>
                                <Input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={date_format(request_info.end_membership_date)}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-1">
                            <Label>មូលហេតុនៃការសុំច្បាប់</Label>
                            <Input
                                type="text"
                                readOnly
                                disabled
                                value={request_info.reason}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="col-span-1 space-y-1">
                                <Label>ចាប់ពីថ្ងៃ</Label>
                                <Input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={date_format(request_info.from_date)}
                                />
                            </div>

                            <div className="col-span-1 space-y-1">
                                <Label>ដល់ថ្ងៃទី</Label>
                                <Input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={date_format(request_info.to_date)}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-1">
                            <Label>ថ្ងៃផុតសពលភាពថ្មី</Label>
                            <Input
                                type="text"
                                readOnly
                                disabled
                                value={date_format(request_info.new_end)}
                            />
                        </div>

                        <div className="w-full space-y-1">
                            <Label>មិតិយោបល់</Label>
                            <Input
                                autoFocus
                                type="text"
                                required
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-row-reverse gap-2">
                        {
                            request_info.checker_status !== "Pending" ?
                                <Button
                                    type="button"
                                    variant="default"
                                    onClick={async () => {
                                        //TODO: Update To Checked
                                        setOpenApprove(false);
                                    }}
                                >
                                    Close
                                </Button>
                                :
                                <>
                                    <Button
                                        type="button"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={async () => {
                                            //TODO: Update To Checked
                                            const res = await checkerApprove({
                                                variables: {
                                                    checkedBy: parseInt(localStorage.getItem("user_id") || "0"),
                                                    requestId: request_info.request_id,
                                                    checkerComment: description,
                                                    checkerStatus: "Approved"
                                                }
                                            })

                                            if (res.data?.CheckHoldRequest.success) {
                                                Notifications("Approved", "success")
                                                setOpenApprove(false);
                                                refetch();
                                                return;
                                            }

                                            Notifications("Failed", "error")

                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={async () => {
                                            //TODO: Update To Checked
                                            const res = await checkerApprove({
                                                variables: {
                                                    checkedBy: parseInt(localStorage.getItem("user_id") || "0"),
                                                    requestId: request_info.request_id,
                                                    checkerComment: description,
                                                    checkerStatus: "Rejected"
                                                }
                                            })

                                            if (res.data?.CheckHoldRequest.success) {
                                                setOpenApprove(false);
                                                refetch();
                                                Notifications("Rejected", "success")
                                                return;
                                            }

                                            Notifications("Failed", "error")

                                        }}
                                    >
                                        Reject
                                    </Button>
                                </>
                        }
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Customer Payment */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>ពត៌មានអតិថិជន</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    payment?.GetMemberPayment.map((payment, index) => {
                                        return (
                                            <tr key={index} className="odd:bg-white even:bg-gray-100 text-left">
                                                <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-800">{date_format(payment.payment_date)}</td>
                                                <td>{payment.promotion}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Receiptionist Print Payment */}
            <Dialog open={open_print} onOpenChange={setOpenPrint}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>វិក្កយបត្រ</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">
                        <HoldInvoice
                            ref={HoldInvoiceRef}
                            invoice_detail={invoice_detail}
                        >
                        </HoldInvoice>
                    </div>
                    <DialogFooter className="flex-row-reverse gap-2">
                        <Button
                            type="button"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => ProcessHold()}
                        >
                            យល់ព្រម
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setOpenPrint(false)}
                        >
                            ចាកចេញ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default HoldRequest