import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '../../../components/DataTable/DataTable';
import LoadingPage from '../../../components/LoadingPage/LoadingPage';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useApproveTransferRequestMutation, useCheckTransferRequestMutation, useCreateTransferMutation, useTransferRequestsQuery } from '../../../generated/graphql';
import Notifications from '../../../components/Notification';
import { PrinterIcon } from '@heroicons/react/20/solid';
import { useReactToPrint } from 'react-to-print';
import { TransferInvoice } from '../../../components/ComponentToPrint/TransferInvoice';

type TransferRequest = {
    request_id: number
    request_by: number
    request_date: string
    reason: string
    sender_id: number
    sender_phone: string
    sender_old_end: string
    receiver_id: number
    checked_by: number
    checker_comment: string
    checked_date: string
    checker_status: string
    approved_by: number
    approver_comment: string
    approved_date: string
    approver_status: string
    process: string
    processed_by: number
    display_name: string
    sender_name: string
    receiver_name: string
    receiver_old_end: string
    receiver_phone: string
    checker_name: string
    approver_name: string
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

const TransferRequest = () => {
    const columnHelper = createColumnHelper<TransferRequest>();
    const columns = [
        columnHelper.accessor((row) => row.display_name, {
            id: "អ្នកស្នើ",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.request_date, {
            id: "ថ្ងៃស្នើ",
            cell: (info) => datetime_format(info.getValue()),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.sender_name, {
            id: "ពីឈ្មោះ",
            cell: (info) =>
                <div
                    onClick={async () => {
                        await getCustomer({
                            variables: {
                                customerId: info.row.original.customer_id
                            }
                        })
                        await getCustomerPayment({
                            variables: {
                                customerId: info.row.original.customer_id
                            }
                        })
                        setOpen(true)
                    }}
                >
                    {info.getValue()}
                </div >,
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.receiver_name, {
            id: "ទៅឈ្មោះ",
            cell: (info) =>
                <div
                    onClick={async () => {
                        await getCustomer({
                            variables: {
                                customerId: info.row.original.customer_id
                            }
                        })
                        await getCustomerPayment({
                            variables: {
                                customerId: info.row.original.customer_id
                            }
                        })
                        setOpen(true)
                    }}
                >
                    {info.getValue()}
                </div >,
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.reason, {
            id: "មូលហេតុ",
            cell: (info) => info.getValue(),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.checker_name, {
            id: "អ្នកពិនិត្យ",
            cell: (info) => (
                <>
                    {
                        info.row.original.checker_status === "Pending" ?
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => {
                                    HandleCheckerApprove();
                                    setRequestID(info.row.original.request_id)
                                }}
                            >
                                Action
                            </button>
                            :
                            <>
                                {
                                    info.row.original.checker_status === "Approved" ?
                                        <div className="group">
                                            <strong className="text-green-500 visible group-hover:invisible">Approved</strong>
                                            <strong className="text-green-500 invisible group-hover:visible">{info.row.original.checker_comment}</strong>
                                        </div>
                                        :
                                        <div className="group">
                                            <strong className="text-red-500 visible group-hover:invisible">Rejected</strong>
                                            <strong className="text-red-500 invisible group-hover:visible">{info.row.original.checker_comment}</strong>
                                        </div>
                                }
                            </>

                    }
                </>

            ),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.approver_name, {
            id: "អ្នកសម្រេច",
            cell: (info) => (
                <>
                    {
                        info.row.original.approver_status === "Pending" ?
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => {
                                    CheckApproverRole();
                                    setRequestID(info.row.original.request_id)
                                }}
                            >
                                Action
                            </button>
                            :
                            <>
                                {
                                    info.row.original.checker_status === "Approved" ?
                                        <div className="group">
                                            <strong className="text-green-500 visible group-hover:invisible">Approved</strong>
                                            <strong className="text-green-500 invisible group-hover:visible">{info.row.original.approver_comment}</strong>
                                        </div>
                                        :
                                        <div className="group">
                                            <strong className="text-red-500 visible group-hover:invisible">Rejected</strong>
                                            <strong className="text-red-500 invisible group-hover:visible">{info.row.original.approver_comment}</strong>
                                        </div>
                                }
                            </>

                    }
                </>

            ),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.request_id, {
            id: "Process",
            cell: ({ row: { original: row_data } }) => (
                <div className="flex">
                    {
                        row_data.checker_status === "Approved" && row_data.approver_status === "Approved" ?
                            <>
                                {
                                    row_data.processed_by === 0 ?
                                        <span className="hidden sm:block">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => {
                                                    setOpenPrint(true)
                                                    setRequestID(row_data.request_id)
                                                    setInvoiceDetail({
                                                        invoice_id: 0, cashier: localStorage.getItem("display_name") || "",
                                                        payment_date: datetime_format(new Date()),
                                                        sender_id: row_data.sender_id, sender_name: row_data.sender_name, sender_phone: row_data.sender_phone, sender_old_end: row_data.sender_old_end, sender_new_end: SenderNewEnd(row_data.sender_old_end),
                                                        receiver_id: row_data.receiver_id, receiver_name: row_data.receiver_name, receiver_phone: row_data.receiver_phone, receiver_old_end: row_data.receiver_old_end, receiver_new_end: ReceiverNewEnd(row_data.sender_old_end, row_data.receiver_old_end),
                                                    })
                                                }}
                                            >
                                                <PrinterIcon
                                                    className="h-4 w-4 text-gray-500"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </span>
                                        :
                                        <p>{row_data.processed_name}</p>
                                }

                            </>
                            :
                            <>
                                {
                                    <p>Pending</p>
                                }
                            </>
                    }
                </div>
            ),
            header: () => <span>Process</span>,
            footer: (info) => info.column.id,
        }),
    ];

    function countDaysBetweenDates(startDate: Date, endDate: Date) {
        // Convert both dates to UTC to ensure accurate calculation
        const utcStartDate = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const utcEndDate = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Calculate the difference in milliseconds
        const timeDifference = utcEndDate - utcStartDate;

        // Convert the difference from milliseconds to days
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference;
    }

    function calculateNewEndDate(startDate: string, daysToAdd: number) {
        // Clone the start date to avoid modifying the original date
        const endDate = new Date(startDate);
        // Use setDate to add the specified number of days
        endDate.setDate(endDate.getDate() + daysToAdd);
        return date_format(endDate);
    }

    function SenderNewEnd(old_end: string) {
        return calculateNewEndDate(old_end, -countDaysBetweenDates(new Date(), new Date(old_end)))
    }

    function ReceiverNewEnd(sender_old_end: string, receiver_old_end: string) {
        const remain_days = countDaysBetweenDates(new Date(), new Date(receiver_old_end))
        if (remain_days <= 0) {
            return invoice_detail.sender_old_end
        } else {
            const sender_remain = countDaysBetweenDates(new Date(), new Date(sender_old_end))
            return calculateNewEndDate(receiver_old_end, sender_remain)
        }
    }

    const HandleCheckerApprove = async () => {
        //TODO: Check Permission
        const userRole = localStorage.getItem("role");
        if (userRole === "Admin" || userRole === "Checker") {
            setOpenChecker(true)
            return;
        }
        Notifications("អ្នកមិនមានសិទ្ធិទេ", "error")
    }

    const CheckApproverRole = async () => {
        //TODO: Check Permission
        const userRole = localStorage.getItem("role");
        if (userRole === "Admin") {
            setOpenApprover(true)
            return;
        }
        Notifications("អ្នកមិនមានសិទ្ធិទេ", "error")
    }

    const [checkerApprove] = useCheckTransferRequestMutation();
    const [approveTransfer] = useApproveTransferRequestMutation();
    const [createTransfer] = useCreateTransferMutation();
    const { data, loading, refetch } = useTransferRequestsQuery({ fetchPolicy: "no-cache" })

    const [open_checker, setOpenChecker] = useState(false)
    const [open_approver, setOpenApprover] = useState(false)
    const [request_id, setRequestID] = useState(0)
    const [description, setDescription] = useState("")
    const [open_print, setOpenPrint] = useState(false)
    const cancelButtonRef = useRef<HTMLButtonElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null);
    const InvoiceRef = useRef<HTMLDivElement>(null);

    const [invoice_detail, setInvoiceDetail] = useState({
        invoice_id: 0, cashier: "", payment_date: "",
        sender_id: 0, sender_name: "", sender_phone: "", sender_old_end: "", sender_new_end: "",
        receiver_id: 0, receiver_name: "", receiver_phone: "", receiver_old_end: "", receiver_new_end: "",
    })

    const handlePrint = useReactToPrint({
        content: () => InvoiceRef.current,
        print: async (printIframe: HTMLIFrameElement) => {
            // Do whatever you want here, including asynchronous work
            await SendToElectronPrinter(printIframe);
        }
    });

    const SendToElectronPrinter = async (target: HTMLIFrameElement) => {
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

    async function ProcessTransfer(): Promise<void> {

        const { sender_id, sender_old_end, sender_new_end, receiver_id, receiver_old_end, receiver_new_end } = invoice_detail

        const { data: { CreateTransfer: res } } = await createTransfer({
            variables: {
                requestId: request_id,
                processedBy: parseInt(localStorage.getItem("user_id") || "99"),
                receiverNewEnd: receiver_new_end,
                receiverOldEnd: receiver_old_end,
                receiverId: receiver_id,
                senderNewEnd: sender_new_end,
                senderOldDate: sender_old_end,
                senderId: sender_id
            }
        })
        if (res.success) {
            setInvoiceDetail({ ...invoice_detail, invoice_id: res.transfer_id })
            return;
        }
        Notifications("បរាជ័យ", "error")
    }

    useEffect(() => {
        // This function will be called after the component re-renders
        if (invoice_detail.invoice_id > 0) {
            Notifications("ជោគជ័យ", "success")
            buttonRef.current.click();
            setOpenPrint(false);
        }
    }, [invoice_detail]);

    return (
        <>
            {!loading ? (
                <DataTable
                    columns={columns}
                    data={data?.TransferRequests}
                />
            ) : (
                <LoadingPage message={"Loading"} />
            )}

            <button
                className="hidden"
                ref={buttonRef}
                type="button"
                onClick={handlePrint}
            >
                Print
            </button >

            {/* Checker Approve Or Reject */}
            <Transition.Root show={open_checker} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenChecker}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                                    បរិយាយ
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={async () => {
                                                //TODO: Update To Checked
                                                const res = await checkerApprove({
                                                    variables: {
                                                        checkedBy: parseInt(localStorage.getItem("user_id") || "0"),
                                                        requestId: request_id,
                                                        checkerComment: description,
                                                        checkerStatus: "Approved"
                                                    }
                                                })

                                                if (res.data?.CheckTransferRequest.success) {
                                                    Notifications("Approved", "success")
                                                    setOpenChecker(false);
                                                    refetch();
                                                    return;
                                                }

                                                Notifications("Failed", "error")

                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={async () => {
                                                //TODO: Update To Checked
                                                const res = await checkerApprove({
                                                    variables: {
                                                        checkedBy: parseInt(localStorage.getItem("user_id") || "0"),
                                                        requestId: request_id,
                                                        checkerComment: description,
                                                        checkerStatus: "Rejected"
                                                    }
                                                })

                                                if (res.data?.CheckTransferRequest.success) {
                                                    setOpenChecker(false)
                                                    refetch();
                                                    Notifications("Rejected", "success")
                                                    return;
                                                }

                                                Notifications("Failed", "error")

                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >

            {/* Admin Approve Or Reject */}
            <Transition.Root show={open_approver} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenApprover}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                                    បរិយាយ
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        required
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={async () => {
                                                //TODO: Update To Checked
                                                const res = await approveTransfer({
                                                    variables: {
                                                        approvedBy: parseInt(localStorage.getItem("user_id") || "0"),
                                                        requestId: request_id,
                                                        approverComment: description,
                                                        approverStatus: "Approved"
                                                    }
                                                })

                                                if (res.data?.ApproveTransferRequest.success) {
                                                    Notifications("Approved", "success")
                                                    setOpenApprover(false);
                                                    refetch();
                                                    return;
                                                }

                                                Notifications("Failed", "error")

                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={async () => {
                                                //TODO: Update To Checked
                                                const res = await approveTransfer({
                                                    variables: {
                                                        approvedBy: parseInt(localStorage.getItem("user_id") || "0"),
                                                        requestId: request_id,
                                                        approverComment: description,
                                                        approverStatus: "Rejected"
                                                    }
                                                })

                                                if (res.data?.ApproveTransferRequest.success) {
                                                    Notifications("Rejected", "success")
                                                    refetch();
                                                    setOpenApprover(false);
                                                    return;
                                                }

                                                Notifications("Failed", "error")

                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >

            {/* Receiptionist Print Payment */}
            <Transition.Root show={open_print} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenPrint}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <div className="mt-2">
                                                    <TransferInvoice
                                                        ref={InvoiceRef}
                                                        invoice_detail={invoice_detail}
                                                    >
                                                    </TransferInvoice>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => ProcessTransfer()}
                                        >
                                            Process
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpenPrint(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

export default TransferRequest
