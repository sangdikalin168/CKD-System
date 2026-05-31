import React, { ForwardedRef } from 'react';

interface PropsType {
    invoice_detail: {
        invoice_id: number
        payment_date: string
        cashier: string
        sender_name: string
        sender_phone: string
        sender_old_end: string
        sender_new_end: string
        receiver_name: string
        receiver_phone: string
        receiver_old_end: string
        receiver_new_end: string
    };
}


export const TransferInvoice = React.forwardRef((props: PropsType, ref: ForwardedRef<HTMLDivElement>) => {

    const date_format = (date_time: string) => {
        const date = new Date(date_time);
        return date.toLocaleDateString("fr-CA");
    };

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

    const {
        invoice_id, payment_date, cashier,
        sender_name,
        sender_phone,
        sender_old_end,
        sender_new_end,
        receiver_name,
        receiver_phone,
        receiver_old_end,
        receiver_new_end,
    } = props.invoice_detail

    return (
        <div ref={ref} className="w-[405px] left-0 top-0 z-10 justify-center content-center overflow-auto border-2 border-black">
            <div className="text-center pt-3">
                <p className="text-lg font-semibold text-black">មិង ហួរក្លឹបហាត់ប្រាណ & អាងហែលទឹក</p>
                <p className="text-lg font-semibold text-black">(សាខាចំការដូង)</p>
                <p className="text-lg font-semibold text-black">វិក័យប័ត្រ</p>
            </div>

            <div className="text-lg font-semibold text-black">
                វិក័យប័ត្រលេខ: <strong >{invoice_id}</strong>
            </div>
            <div className="flex text-xs">
                <p className="text-lg font-semibold text-black mr-4">ថ្ងៃបង់ប្រាក់: {payment_date}</p>
            </div>
            <div className="flex text-xs">
                <p className="text-lg font-semibold text-black" id="print_cashier">បេឡាក: {cashier}</p>
            </div>

            <div>
                <table className="w-full text-lg font-semibold text-black">
                    <thead className="bg-black ">
                        <tr className="text-white w-full">
                            <th className="py-1 text-left">បរិយាយ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left">ការផ្ទេរសុពលភាពអតិថិជន</td>
                        </tr>
                        <tr>
                            <td className="text-left">អ្នកផ្ទេរ: {sender_name} | Phone: {sender_phone}</td>
                        </tr>
                        <tr>
                            <td className="text-left">សុពលភាពចាស់: {date_format(sender_old_end)} ({countDaysBetweenDates(new Date(), new Date(sender_old_end))}ថ្ងៃ)</td>
                        </tr>
                        <tr>
                            <td className="text-left">សុពលភាពថ្មី: {date_format(sender_new_end)} (ដក {-countDaysBetweenDates(new Date(), new Date(sender_old_end))}ថ្ងៃ)</td>
                        </tr>
                        <tr>
                            <td className="text-left">អ្នកទទួល: {receiver_name} | Phone: {receiver_phone}</td>
                        </tr>
                        <tr>
                            <td className="text-left">សុពលភាពចាស់: {date_format(receiver_old_end)} ({countDaysBetweenDates(new Date(), new Date(receiver_old_end))}ថ្ងៃ)</td>
                        </tr>
                        <tr>
                            <td className="text-left">សុពលភាពថ្មី: {date_format(receiver_new_end)} (ថែម {countDaysBetweenDates(new Date(), new Date(sender_old_end))}ថ្ងៃ)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="my-2 bg-black h-[2px]" />
            <div>
                <div className="flex text-lg text-black font-semibold">
                    <div className="flex-grow">ថ្លៃសេវា</div>
                    <div>1$</div>
                </div>
                <hr className="my-2 bg-black h-[2px]" />
            </div>
            <div className="text-center">
                <p className="text-lg font-semibold text-black">សូមអរគុណ!</p>
                <p className="text-lg font-semibold text-black">012 558 789 / 070 239 789</p>
                <p className="text-lg font-semibold text-black">អាសយដ្ឋានលេខៈ 81AE0E1 ផ្លូវ40D សង្កាត់ដង្កោ</p>
                <p className="text-lg font-semibold text-black">ខណ្ឌដង្កោ រាជធានីភ្នំពេញ</p>
            </div>
        </div>
    );
});