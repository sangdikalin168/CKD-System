/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ComponentToPrint } from '../../components/ComponentToPrint';
import { v4 as uuidv4 } from 'uuid';

export default function Ticket() {

    const [uuid, setUuid] = useState("");
    const componentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLInputElement>(null);

    const handlePrint1 = async (target: HTMLIFrameElement) => {
        return new Promise(() => {
            console.log('forwarding print request to the main process...');
            const data = target.contentWindow.document.documentElement.outerHTML;
            const blob = new Blob([data], { type: 'text/html; charset=utf-8' });
            const url = URL.createObjectURL(blob);
            window.electronAPI.printComponent1(url, (response: any) => {
                console.log('Main: ', response);
            });
        });
    };


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        print: async (printIframe: HTMLIFrameElement) => {
            // Do whatever you want here, including asynchronous work
            await handlePrint1(printIframe);
        },
    });

    const handleGetQRCode = async () => {
        const unique_id = await uuidv4();
        const small_id = await unique_id.slice(0, 16)
        const result = await setUuid(small_id);
        buttonRef.current.click();
    }


    return (
        <div>
            <div className="h-full p-4 bg-gray-100 shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-cyan-400">
                    <h3 className="text-lg font-bold leading-6 text-white">លក់សំបុត្រ</h3>
                </div>
                <button className="hidden" ref={buttonRef} type="button" onClick={handlePrint}>Print</button>

                <div className="flex border-t border-gray-200">
                    {
                        ticket_list.map((list) => {
                            return (
                                <div key={list.price} className="relative bg-cyan-400 w-32 h-32 rounded-lg shadow m-2">
                                    <span className="w-full h-full flex justify-center items-center text-5xl font-black">
                                        <button className="w-full h-full" onClick={handleGetQRCode}>{list.price}$</button>
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='hidden'>
                    <ComponentToPrint ref={componentRef} price="1.5$" name="Chenda" uuid={uuid} />
                </div>

            </div >
        </div>
    )
}

const ticket_list = [{ price: 1 }, { price: 2 }, { price: 3 }, { price: 4 }]
