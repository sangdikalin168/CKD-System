import React, { ForwardedRef } from 'react';

interface PropsType {
    invoice_detail: {
        invoice_id: number
        payment_date: string
        cashier: string
        customer_name: string
        phone: string
        start_date: string
        end_date: string
        old_end: string
        new_end: string
    };
}


export const HoldInvoice = React.forwardRef((props: PropsType, ref: ForwardedRef<HTMLDivElement>) => {


    const { invoice_id, payment_date, cashier, customer_name, phone, start_date, end_date, old_end, new_end } = props.invoice_detail

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

            <div className="flex text-xs">
                <p className="text-lg font-semibold text-black mr-4" id="customer">អតិថិជន: {customer_name}</p>
                <p className="text-lg font-semibold text-black" id="phone_number">លេខទូរស័ព្ទ: {phone}</p>
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
                            <td className="text-left">ការពន្យាសុពលភាពអតិថិជន</td>
                        </tr>
                        <tr>
                            <td className="text-left">ចាប់ពីថ្ងៃ: {start_date} - ដល់ថ្ងៃ: {end_date}</td>
                        </tr>
                        <tr>
                            <td className="text-left">សុពលភាពចាស់: {old_end}</td>
                        </tr>
                        <tr>
                            <td className="text-left">សុពលភាពថ្មី: {new_end}</td>
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