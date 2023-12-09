import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import { DateTimePicker } from "../../../../components/DateTimePicker/DateTimePicker";
import DatePicker from "tailwind-datepicker-react";
import { IOptions } from "tailwind-datepicker-react/types/Options";
import { useCreateHoldRequestMutation } from "../../../../generated/graphql";
import Notifications from "../../../../components/Notification";

const date_format = (date_time: string | Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
};

const HoldForm = ({ open_hold, setOpenHold, customer_id, old_end }: any) => {

    const cancelButtonRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showDateTo, setShowDateTo] = useState(false);

    const handleCloseDateTo = (state: boolean) => {
        setShowDateTo(state);
    };
    const [selectedDateTo, setSelectedDateTo] = useState(
        date_format(new Date(old_end))
    );

    const handleChangeDateTo = (selectedDate: Date) => {
        if (selectedDate > new Date(selectedDateFrom)) {
            setSelectedDateTo(date_format(selectedDate));
        } else if (selectedDate < new Date(selectedDateFrom)) {
            Notifications("ថ្ងៃបញ្ចប់មិនត្រឹមត្រូវ", "error")
        }
    };

    const [showDateFrom, setShowDateFrom] = useState<boolean>(false);
    const handleCloseDateFrom = (state: boolean) => {
        setShowDateFrom(state);
    };
    const [selectedDateFrom, setSelectedDateFrom] = useState(
        date_format(new Date(old_end))
    );
    const handleChangeDateFrom = (selectedDate: Date) => {
        //TODO: Condition Must Bigger Than Present
        //TODO: Compare End Date Between Present
        const currentDate = new Date();
        if (selectedDate > currentDate) {
            setSelectedDateFrom(date_format(selectedDate));
        } else if (selectedDate < currentDate) {
            Notifications("ថ្ងៃចាប់ផ្តើមមិនត្រឹមត្រូវ", "error")
        }
    };

    const [reason, setReason] = useState("")

    const [createHoldRequest] = useCreateHoldRequestMutation();

    function countDaysBetweenDates(startDate, endDate) {
        // Convert both dates to UTC to ensure accurate calculation
        const utcStartDate = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const utcEndDate = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Calculate the difference in milliseconds
        const timeDifference = utcEndDate - utcStartDate;

        // Convert the difference from milliseconds to days
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        console.log(daysDifference);


        return daysDifference;
    }

    function calculateNewEndDate(startDate, daysToAdd) {
        // Clone the start date to avoid modifying the original date
        const endDate = new Date(startDate);
        // Use setDate to add the specified number of days
        endDate.setDate(endDate.getDate() + daysToAdd);
        return date_format(endDate);
    }

    const HandleCreateHoldRequest = async () => {
        //TODO: Condition Before Insert Data
        if (reason === "") {
            Notifications("សូមបញ្ចូលមូលហេតុ", "error")
            return;
        }

        const days = countDaysBetweenDates(new Date(), new Date(old_end))
        const new_end = calculateNewEndDate(new Date(selectedDateTo), days);
        const res = await createHoldRequest({
            variables: {
                requestBy: parseInt(localStorage.getItem("user_id")),
                customerId: customer_id,
                reason: reason,
                fromDate: selectedDateFrom,
                toDate: selectedDateTo,
                oldEnd: old_end,
                newEnd: new_end
            }
        })
        if (res.data?.CreateHoldRequest.success) {
            Notifications("ជោគជ័យ", "success")
            setOpenHold(false)
            return;
        }
    }

    return (
        <Transition.Root show={open_hold} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpenHold}
            >
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
                            <Dialog.Panel className="relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="">
                                        <div className="mt-3">
                                            <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                                        មូលហេតុនៃការសុំច្បាប់
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            required
                                                            onChange={(e) => setReason(e.target.value)}
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                {/* DateTime Picker */}
                                                <div className="col-span-2 mr-1">
                                                    <label className="mb-2 block text-sm font-medium leading-6 text-gray-900">
                                                        ចាប់ពីថ្ងៃ
                                                    </label>

                                                    <DateTimePicker
                                                        onChange={handleChangeDateFrom}
                                                        value={selectedDateFrom}
                                                        show={showDateFrom}
                                                        setShow={handleCloseDateFrom}
                                                        classNames={"top-[-62px]"}
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="mb-2 block text-sm font-medium leading-6 text-gray-900">
                                                        ដល់ថ្ងៃទី
                                                    </label>
                                                    <DateTimePicker
                                                        onChange={handleChangeDateTo}
                                                        value={selectedDateTo}
                                                        show={showDateTo}
                                                        setShow={handleCloseDateTo}
                                                        classNames={"top-[-62px]"}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                        onClick={() => {
                                            HandleCreateHoldRequest()
                                        }}
                                    >
                                        ដាក់ការស្នើរសុំ
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        onClick={() => {
                                            setOpenHold(false);
                                        }}
                                    >
                                        បោះបង់
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )

}
export default HoldForm