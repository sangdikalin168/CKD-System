import { ArrowUpTrayIcon, CameraIcon, UserCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateMember = ({ setShow, onSubmit }: any) => {


    const [customer_name, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("ប្រុស");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Create the data object with the necessary information
        const data = {
            customer_name: customer_name,
            phone: phone,
            gender: gender
        };
        // Pass the data to the parent component's onSubmit function
        onSubmit(data);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="border-2 p-2 mb-2 rounded-md bg-white">
                <div>
                    <div>
                        <div className="grid grid-cols-1 gap-x-2 gap-y-2 sm:grid-cols-6">
                            <div className="sm:col-span-2 space-y-2">
                                <Label>
                                    ឈ្មោះអតិថិជន
                                </Label>
                                <Input
                                    type="text"
                                    required
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="last-name">
                                    លេខទូរស័ព្ទ
                                </Label>
                                <Input
                                    id="last-name"
                                    type="text"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="gender">
                                    ភេទ
                                </Label>
                                <select
                                    id="gender"
                                    className="block w-full rounded-md border border-input bg-background py-1.5 px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option defaultValue={"ប្រុស"} value="ប្រុស">ប្រុស</option>
                                    <option value="ស្រី">ស្រី</option>
                                </select>
                            </div>

                            <div className="col-span-full">
                                <div className="flex mt-2 items-center gap-x-3">
                                    <UserCircleIcon className="h-32 w-32 text-gray-300" aria-hidden="true" />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex gap-x-1"
                                    >
                                        <ArrowUpTrayIcon className="h-5 w-5" />
                                        បញ្ចូលរូប
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex gap-x-1"
                                    >
                                        <CameraIcon className="h-5 w-5" />
                                        ថតរូប
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button type="button" variant="ghost" onClick={() => setShow(false)}>
                        បោះបង់
                    </Button>
                    <Button type="submit">
                        រក្សារទុក
                    </Button>
                </div>
            </form>
        </>
    )
}

export default CreateMember