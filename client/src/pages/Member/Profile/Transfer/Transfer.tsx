import { useState } from "react";
import InputField from "../../../../components/Input/InputField";
import Modal from "../../../../components/Modal/Modal";
import Notifications from "../../../../components/Notification";

const date_format = (date_time: string | Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
};

const Transfer = ({ open, setOpen, sender_data }: any) => {

    const [reason, setReason] = useState("")
    const [customer_id, setCustomerID] = useState(0)
    const [show_customer, setShowCustomer] = useState(true);
    const [new_end, setNewEnd] = useState("");

    const FindCustomer = (customer_id: number) => {
        Notifications("Customer Not Found!!!", "error")
    }

    const SendRequest = () => {
        alert(sender_data.customer_name)
    }

    function countDaysBetweenDates(startDate, endDate) {
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

    return (
        <Modal open={open} setOpen={setOpen} onConfirm={SendRequest}>
            {
                show_customer !== true ? (
                    <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
                        <InputField classNames={"col-span-6"} value={customer_id} type={"number"} label={"Customer ID"} onChange={setCustomerID} />
                        <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                            onClick={() => FindCustomer(customer_id)}
                        >
                            Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
                        <InputField classNames={"col-span-6"} value={reason} type={"text"} label={"មូលហេតុនៃការផ្ទេរ"} onChange={setReason} />
                        <InputField classNames={"col-span-3"} value={"Sok Soksa"} type={"text"} label={"អ្នកទទួល"} readOnly={true} />
                        <InputField classNames={"col-span-3"} value={""} type={"text"} label={"Phone"} readOnly={true} />
                        <InputField classNames={"col-span-3"} value={""} type={"text"} label={"Old End"} readOnly={true} />
                        <InputField classNames={"col-span-3"} value={new_end} type={"text"} label={"New End"} readOnly={true} />
                    </div>
                )
            }
        </Modal>
    )
}

export default Transfer