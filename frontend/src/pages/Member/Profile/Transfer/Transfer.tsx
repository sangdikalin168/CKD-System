import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import Notifications from "../../../../components/Notification";
import { useCreateTransferRequestMutation, useGetCustomerDetailLazyQuery } from "../../../../generated/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const date_format = (date_time: string | Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
};

const Transfer = ({ open, setOpen, sender_data }: any) => {

    const [reason, setReason] = useState("")
    const [customer_id, setCustomerID] = useState(0)
    const [show_customer, setShowCustomer] = useState(false);
    const [receiver, setReceiver] = useState()


    const [getMemberDetail] = useGetCustomerDetailLazyQuery();
    const [createTransferRequest] = useCreateTransferRequestMutation();


    const FindCustomer = async (customer_id: number) => {
        if (customer_id === "") {
            Notifications("Please Input Customer ID", "error")
            return;
        }

        const { data } = await getMemberDetail({
            variables: {
                customerId: parseInt(customer_id)
            }
        })

        if (data.GetCustomerDetail.length <= 0) {
            Notifications("Customer Not Found!!!", "error")
            return;
        }
        setShowCustomer(true)
        setReceiver(data.GetCustomerDetail[0]);

    }

    const SendRequest = async () => {
        const res = await createTransferRequest({
            variables: {
                reason: reason,
                receiverId: receiver.customer_id,
                senderId: sender_data.customer_id,
                requestBy: parseInt(localStorage.getItem("user_id") || "99"),
            }
        })

        if (res.data?.CreateTransferRequest.success) {
            Notifications("Success", "success")
            setOpen(false)
            return;
        }

        Notifications("Error", "error")
    }

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

    function ReceiverNewEnd() {
        const remain_days = countDaysBetweenDates(new Date(), new Date(receiver?.end_membership_date))
        if (remain_days <= 0) {
            return sender_data.end_membership_date
        } else {
            const sender_remain = countDaysBetweenDates(new Date(), new Date(sender_data.end_membership_date))
            return calculateNewEndDate(receiver?.end_membership_date, sender_remain)
        }
    }

    return (
        <Modal open={open} setOpen={setOpen} onConfirm={SendRequest} onCancel={() => { setShowCustomer(false); setCustomerID(0) }}>
            {
                show_customer !== true ? (
                    <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
                        <div className="col-span-6 space-y-2">
                            <Label>Customer ID</Label>
                            <Input
                                type="number"
                                value={customer_id}
                                onChange={(e) => setCustomerID(e.target.value)}
                            />
                        </div>
                        <Button
                            type="button"
                            className="col-span-6 w-full"
                            onClick={() => FindCustomer(customer_id)}
                        >
                            Search
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">

                        {/* Sender */}
                        <div className="col-span-6 text-red-500">
                            <p className="font-bold">អ្នកផ្ទេរ</p>
                            <p>សុពលភាពចាស់ : {sender_data.end_membership_date} ({countDaysBetweenDates(new Date(), new Date(sender_data.end_membership_date))}ថ្ងៃ)</p>
                            <p>សុពលភាពថ្មី : {calculateNewEndDate(sender_data.end_membership_date, -countDaysBetweenDates(new Date(), new Date(sender_data.end_membership_date)))} ({-countDaysBetweenDates(new Date(), new Date(sender_data.end_membership_date))}ថ្ងៃ)</p>
                        </div>

                        <p className="col-span-6 text-red-500">------------------------------------------------------------------------------</p>
                        {/* Receiver */}
                        <div className="col-span-6 text-blue-500">
                            <p className="font-bold">អ្នកទទួល</p>
                            <p>ឈ្មោះ : {receiver?.customer_name}</p>
                            <p>លេខទូរស័ព្ទ : {receiver?.phone}</p>
                            <p>សុពលភាពចាស់ : {receiver?.end_membership_date} ({countDaysBetweenDates(new Date(), new Date(receiver?.end_membership_date))}ថ្ងៃ)</p>
                            <p>សុពលភាពថ្មី : {ReceiverNewEnd()} ({countDaysBetweenDates(new Date(), new Date(sender_data.end_membership_date))}ថ្ងៃ)</p>
                        </div>

                        <div className="col-span-6 space-y-2">
                            <Label>មូលហេតុនៃការផ្ទេរ</Label>
                            <Input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                    </div>
                )
            }
        </Modal>
    )
}

export default Transfer
