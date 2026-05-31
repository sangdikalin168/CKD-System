import { useRef, useState } from "react";
import {
    useUpdateCustomerMutation,
} from "../../../../generated/graphql";

import { TypeOptions, toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


const notify = (
    message: string,
    auto_Close: boolean | number,
    toastType: TypeOptions
) => {
    if (!toast.isActive("alert")) {
        toast(message, {
            autoClose: auto_Close ? 1500 : false,
            toastId: "alert",
            type: toastType,
        });
    }
};


export const UpdateProfile = (props) => {

    const cancelButtonRef = useRef(null);
    const [phone, setPhone] = useState("");

    const [updateCustomer] = useUpdateCustomerMutation();
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const result = await updateCustomer({
            variables: {
                phone: phone,
                customerId: props.customer_id
            },
        });

        if (result.data?.UpdateCustomer.success) {
            notify("Success", true, "success");
            props.refetch();
            props.setOpen(false);
            return;
        }
        notify("Failed: " + result.data?.UpdateCustomer.message, 5000, "error");
        props.setOpen(false);
        props.refetch();

    };
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        សូមពិនិត្យលេខទូរស័ព្ទ
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} id="update_form">
                    <div className="mt-2">
                        <Input
                            type="text"
                            required
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </form>
                <DialogFooter className="sm:flex-row-reverse gap-2">
                    <Button
                        type="submit"
                        form="update_form"
                        className="bg-green-500 hover:bg-red-500"
                    >
                        យល់ព្រម
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        ref={cancelButtonRef}
                        onClick={() => {
                            props.setOpen(false);
                        }}
                    >
                        បោះបង់
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
