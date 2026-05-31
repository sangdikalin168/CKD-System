import { TypeOptions, toast } from "react-toastify";

const Notifications = (message: string, toastType: TypeOptions) => {
    if (!toast.isActive("alert")) {
        toast(message, {
            autoClose: 3000,
            toastId: "alert",
            type: toastType,
        });
    }
};
export default Notifications;