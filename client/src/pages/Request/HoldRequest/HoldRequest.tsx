import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../../components/DataTable/DataTable"
import LoadingPage from "../../../components/LoadingPage/LoadingPage"
import { useApproveHoldRequestMutation, useCheckHoldRequestMutation, useGetCustomerDetailLazyQuery, useGetMemberPaymentLazyQuery, useHoldRequestsQuery } from "../../../generated/graphql";
import { PrinterIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Notifications from "../../../components/Notification";

type HoldRequest = {
    display_name: string
    request_id: number
    request_date: string
    reason: string
    from_date: string
    to_date: string
    customer_id: number
    customer_name: string
    checker_name: string
    checked_by: number
    checker_approved_date: string
    checker_comment: string
    approved_name: string
    approved_by: number
    approved_date: string
    approver_comment: string
}

const datetime_format = (date_time: string) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA") + " " + date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
};

const date_format = (date_time: string) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
};


const HoldRequest = () => {
    const columnHelper = createColumnHelper<HoldRequest>();
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
        columnHelper.accessor((row) => row.customer_name, {
            id: "ឈ្មោះអតិថិជន",
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
        columnHelper.accessor((row) => row.request_date, {
            id: "ចាប់ពី",
            cell: (info) => date_format(info.getValue()),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.request_date, {
            id: "ដល់",
            cell: (info) => date_format(info.getValue()),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.checker_name, {
            id: "អ្នកពិនិត្យ",
            cell: (info) => (
                <>
                    {
                        info.row.original.checked_by === -1 ?
                            <strong className="text-red-500">Rejected</strong>
                            :
                            <>
                                {
                                    info.row.original.checked_by > 0 ? <strong className="text-green-500">Approved</strong> :
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
                                }
                            </>
                    }
                </>

            ),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.approved_name, {
            id: "អ្នកសម្រេច",
            cell: (info) => (
                <>
                    {
                        info.row.original.approved_by === -1 ? <strong className="text-red-500">Rejected</strong>
                            :
                            <>
                                {
                                    info.row.original.approved_by > 0 ? <strong className="text-green-500">Approved</strong> :
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            onClick={() => {
                                                setOpenApprover(true);
                                                setRequestID(info.row.original.request_id);
                                            }}
                                        >
                                            Action
                                        </button>
                                }
                            </>
                    }
                </>

            ),
            header: (info) => <span>{info.column.id}</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.request_id, {
            id: "Status",
            cell: (info) => (
                <div className="flex">
                    {
                        info.row.original.checker_name && info.row.original.approved_name !== null ?
                            <>
                                <span className="hidden sm:block">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    // onClick={() => {
                                    //     setShowProfile(!showProfile);
                                    //     setCustomerID(info.row.original.customer_id);
                                    // }}
                                    >
                                        <PrinterIcon
                                            className="h-4 w-4 text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </span>
                            </> : <strong className="text-red-600">Pending</strong>
                    }
                </div>
            ),
            header: () => <span>Action</span>,
            footer: (info) => info.column.id,
        }),
    ];

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

    const [getCustomer, { data: member }] = useGetCustomerDetailLazyQuery({ fetchPolicy: "no-cache" });
    const [getCustomerPayment, { data: payment }] = useGetMemberPaymentLazyQuery({ fetchPolicy: "no-cache" });

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    const [open_checker, setOpenChecker] = useState(false)
    const [open_approver, setOpenApprover] = useState(false)
    const [description, setDescription] = useState("")
    const [request_id, setRequestID] = useState(0)

    return (
        <>
            {!loading ? (
                <DataTable
                    columns={columns}
                    data={data?.HoldRequests}
                />
            ) : (
                <LoadingPage message={"Loading"} />
            )}

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
                                                        checkedBy: parseInt(localStorage.getItem("user_id")),
                                                        requestId: request_id,
                                                        checkerComment: description
                                                    }
                                                })

                                                if (res.data?.CheckHoldRequest.success) {
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
                                                        checkedBy: -1,
                                                        requestId: request_id,
                                                        checkerComment: description
                                                    }
                                                })

                                                if (res.data?.CheckHoldRequest.success) {
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
            </Transition.Root>

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
                                                const res = await approveHold({
                                                    variables: {
                                                        approvedBy: parseInt(localStorage.getItem("user_id")),
                                                        requestId: request_id,
                                                        approverComment: description
                                                    }
                                                })

                                                if (res.data?.ApproveHoldRequest.success) {
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
                                                const res = await approveHold({
                                                    variables: {
                                                        approvedBy: -1,
                                                        requestId: request_id,
                                                        approverComment: description
                                                    }
                                                })

                                                if (res.data?.ApproveHoldRequest.success) {
                                                    Notifications("Approved", "success")
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
        </>
    )
}

export default HoldRequest