import LoadingPage from "../../../components/LoadingPage/LoadingPage"
import { useApproveHoldRequestMutation, useCheckHoldRequestMutation, useCreateHoldMutation, useGetCustomerDetailLazyQuery, useGetMemberPaymentLazyQuery, useHoldRequestsQuery } from "../../../generated/graphql";
import { CheckCircleIcon, PrinterIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Notifications from "../../../components/Notification";
import { HoldInvoice } from "../../../components/ComponentToPrint/HoldInvoice";
import { useReactToPrint } from "react-to-print";


type HoldRequest = {
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
        }
    }, [invoice_detail]);

    return (
        <>
            {!loading ? (
                <div className="grid grid-cols-1 gap-6 mb-6">
                    <div className="bg-white border border-gray-200 shadow-md shadow-black/5 p-2 rounded-md">
                        <div className="flex items-center mb-4 order-tab">
                            <button type="button" data-tab="order" data-tab-page="active" className=" bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">Pending</button>
                            <button type="button" data-tab="order" data-tab-page="completed" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">Approved</button>
                            <button type="button" data-tab="order" data-tab-page="canceled" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tr-md rounded-br-md hover:text-gray-600">Rejected</button>
                        </div>
                        <div className="overflow-x-auto">
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
                                                                            <span className="inline-block p-1 rounded bg-emerald-500/10 text-red-500 font-medium text-[12px] leading-none">
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
                        </div>
                    </div>

                </div>
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
            </button>

            {/*Approve Or Reject */}
            <Transition.Root show={open_approve} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenApprove}>
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
                        <div className="flex min-h-full items-center sm:items-center justify-center p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-[350px] sm:max-w-lg w-[350px]">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:items-start">
                                            <div className="w-full">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                                    ឈ្មោះអតិថិជន
                                                </label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    disabled
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={request_info.customer_name}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-2">
                                                <div className="col-span-1">
                                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                                        លេខទូរស័ព្ទ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        value={request_info.phone}
                                                    />
                                                </div>

                                                <div className="col-span-1">
                                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                                        ថ្ងៃផុតសពលភាពចាស់
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        value={date_format(request_info.end_membership_date)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-full mt-2">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                                    មូលហេតុនៃការសុំច្បាប់
                                                </label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    disabled
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={request_info.reason}
                                                />
                                            </div>


                                            <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-2">
                                                <div className="col-span-1">
                                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                                        ចាប់ពីថ្ងៃ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        value={date_format(request_info.from_date)}
                                                    />
                                                </div>

                                                <div className="col-span-1">
                                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                                        ដល់ថ្ងៃទី
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        disabled
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        value={date_format(request_info.to_date)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-full mt-2">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                                    ថ្ងៃផុតសពលភាពថ្មី
                                                </label>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    disabled
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    value={date_format(request_info.new_end)}
                                                />
                                            </div>


                                            <div className="w-full mt-2">
                                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                                    បរិយាយ
                                                </label>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    required
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-gray-50 px-4 py-3 space-x-4 sm:flex sm:flex-row-reverse sm:px-6">
                                        {
                                            request_info.checker_status !== "Pending" ?
                                                <>
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                        onClick={async () => {
                                                            //TODO: Update To Checked
                                                            setOpenApprove(false);
                                                        }}
                                                    >
                                                        Close
                                                    </button>
                                                </>
                                                :
                                                <>
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
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
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
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
                                                    </button>
                                                </>
                                        }


                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Customer Payment */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    ពត៌មានអតិថិជន
                                                </Dialog.Title>
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpen(false)}
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
                                                    <HoldInvoice
                                                        ref={HoldInvoiceRef}
                                                        invoice_detail={invoice_detail}
                                                    >
                                                    </HoldInvoice>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => ProcessHold()}
                                        >
                                            យល់ព្រម
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpenPrint(false)}
                                        >
                                            ចាកចេញ
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root >
        </>
    )
}

export default HoldRequest