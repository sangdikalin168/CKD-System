import { PencilSquareIcon, PlusCircleIcon, BackwardIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { Tab, Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  useGetCustomerDetailQuery,
  useGetFruitPaymentQuery,
  useGetHoldRequestQuery,
  useGetMemberPaymentQuery,
  useGetTrainningPaymentQuery,
} from "../../../../generated/graphql";
import { TrainingPaymentForm } from "../TrainningForm/TrainningForm";
import { MemberPayment } from "./MemberPayment";
import { TrainningPayment } from "./TrainningPayment";
import { CouponPayment } from "../CouponForm/CouponForm";
import { RenewForm } from "../RenewForm/RenewForm";
import FruitPaymentTable from "./FruitPaymentTable";
import { FruitPayment } from "../FruitPayment/FruitPayment";
import { UpdateProfile } from "./UpdateProfile";
import Notifications from "../../../../components/Notification";
import HoldForm from "../Hold/HoldForm";
import Transfer from "../Transfer/Transfer";
import { BiTransfer } from "react-icons/bi";
import WebcamCapture from "../../../../components/WebcamCapture/WebcamCapture";
import { useMutation } from "@apollo/client";
import { UPDATE_CUSTOMER_PHOTO } from "../../../../graphql/Customer/UpdateCustomerPhoto";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const MemberProfile = ({ ID }: any) => {
  const { data, loading: loading_member_detail, refetch: refetchMemberDetail } = useGetCustomerDetailQuery({
    variables: {
      customerId: ID,
    },
    fetchPolicy: "no-cache"
  });

  const {
    data: member_payment,
    loading: loading_payment,
    refetch: refechMemberPayment,
  } = useGetMemberPaymentQuery({
    variables: {
      customerId: ID,
    },
    fetchPolicy: "no-cache",
  });

  const {
    data: trainning_payment,
    loading: loading_trainning_payment,
    refetch: refetch_trainning_payment,
  } = useGetTrainningPaymentQuery({
    variables: {
      customerId: ID,
    },
    fetchPolicy: "no-cache",
  });

  const { data: fruit_payment, loading: loading_fruit_payment, refetch: fruitPaymentRefetch } = useGetFruitPaymentQuery({
    variables: {
      customerId: ID,
    },
    fetchPolicy: "no-cache",
  })


  const {
    data: request_data,
  } = useGetHoldRequestQuery({
    variables: {
      customerId: ID,
    },
    fetchPolicy: "no-cache",
  });


  const details = data?.GetCustomerDetail[0];

  const [open_coupon, setIsOpenCoupon] = useState(false);
  const [open_trainning, setOpenTrainning] = useState(false);
  const [open_member, setOpenMember] = useState(false);
  const [open_fruit, setOpenFruit] = useState(false);
  const [open_update, setOpenUpdate] = useState(false);
  const [open_hold, setOpenHold] = useState(false);
  const [open_transfer, setOpenTransfer] = useState(false);
  const [open_webcam, setOpenWebcam] = useState(false);
  const [open_preview, setOpenPreview] = useState(false);

  const [updateCustomerPhoto] = useMutation(UPDATE_CUSTOMER_PHOTO);

  const handlePhotoCapture = async (imageSrc: string) => {
    try {
      const result = await updateCustomerPhoto({
        variables: {
          customerId: ID,
          imagePath: imageSrc
        }
      });

      if (result.data?.UpdateCustomerPhoto?.success) {
        Notifications("រូបថតបានរក្សាទុកជោគជ័យ", "success");
        refetchMemberDetail();
      } else {
        Notifications("មានបញ្ហាក្នុងការរក្សាទុករូបថត", "error");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      Notifications("មានបញ្ហាក្នុងការរក្សាទុករូបថត", "error");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Notifications("សូមជ្រើសរើសឯកសាររូបភាពតែប៉ុណ្ណោះ", "error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Notifications("ទំហំឯកសារធំពេក! សូមជ្រើសរើសរូបភាពតូចជាង 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await handlePhotoCapture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };


  const ShowTransferForm = (date: string) => {
    //TODO: Compare End Date Between Now
    const currentDate = new Date();
    const end_date = new Date(date);

    if (end_date >= currentDate) {
      setOpenTransfer(true);
    } else if (end_date < currentDate) {
      Notifications("សមាជិកផុតសុពលភាពហើយ", "info")
    }
  }

  const HandleHold = (date: string) => {
    //TODO: Compare End Date Between Now
    const currentDate = new Date();
    const end_date = new Date(date);

    if (end_date >= currentDate) {
      if (request_data?.GetHoldRequest.length > 0) { //TODO: If Length > 0 It's mean Customer Has Been Holded But not sure Approved or not

        //TODO: Check hold is active or not
        const end_hold = new Date(request_data?.GetHoldRequest[0].to_date)

        if (end_hold >= currentDate && request_data?.GetHoldRequest[0].checker_status == "Approved" && request_data?.GetHoldRequest[0].process == "Done") {
          //TODO: Check Hold Status
          Notifications("អតិថិជនកំពុងសុំច្បាប់", "info")

        } else {
          if (request_data?.GetHoldRequest[0].checker_status === "Approved" && request_data?.GetHoldRequest[0].process == "Pending") {
            Notifications("ការសុំច្បាប់បានឯកភាពរួច! សូមចូលមើលតារាងស្នើសុំ", "info")
            return;
          }

          if (request_data?.GetHoldRequest[0].checker_status === "Pending") {
            Notifications("សំណើបានដាក់រួចហើយ សូមអោយថ្នាក់លើពិនិត្យ", "info")
            return;
          }

          setOpenHold(true);
        }
      } else {
        setOpenHold(true);
      }
    } else if (end_date < currentDate) {
      Notifications("សមាជិកផុតសុពលភាពហើយ", "info")
    }
  }

  if (loading_fruit_payment && loading_member_detail && loading_trainning_payment && loading_payment)
    return (<div>Loading...</div>);

  return (
    <>
      <button
        type="button"
        className="mb-2 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500"
        onClick={() => { window.location.reload(); }}
      >
        <BackwardIcon
          className="-ml-0.5 mr-1.5 h-4 w-4"
          aria-hidden="true"
        />
        ថយក្រោយ
      </button>
      <div className="bg-white p-4 rounded-lg mb-4">
        <div className="border-b border-gray-900/10">
          <div className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-6">
            <div className="shadow-lg rounded-lg p-2">
              <div className="flex flex-col items-center">
                <div 
                  className="relative group cursor-pointer mb-2"
                  onClick={() => setOpenPreview(true)}
                >
                  <img
                    className="h-24 w-24 flex-none rounded-full bg-gray-50 transition-opacity group-hover:opacity-75"
                    src={
                      details?.image_path 
                        ? `http://${window.location.hostname}:4000${details.image_path}`
                        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    }
                    alt={details?.customer_name || "Profile"}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white shadow-sm hover:bg-indigo-500 mb-2"
                  onClick={() => setOpenWebcam(true)}
                >
                  <svg className="-ml-0.5 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  ថតរូប
                </button>
                <label className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs text-white shadow-sm hover:bg-green-500 cursor-pointer">
                  <svg className="-ml-0.5 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  បញ្ចូលរូបភាព
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <div className="min-w-0 flex-auto">
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    លេខ ID: {ID}
                  </p>
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    ឈ្មោះ: {details?.customer_name}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      ទូរស័ព្ទ: {details?.phone}
                    </p>
                    <PencilSquareIcon
                      className="h-4 w-4 text-red-500 hover:text-violet-600" aria-hidden="true"
                      onClick={() => setOpenUpdate(true)}
                    />
                  </div>

                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    ថ្ងៃបង់ប្រាក់: {details?.end_membership_date}
                  </p>
                  {/* <p className="text-sm font-semibold leading-6 text-gray-900">
                    តែជ្រក់: {details?.end_fruit_date}
                  </p> */}
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    វេន: {details?.shift}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mt-2"
                  onClick={() => {
                    setOpenFruit(true);
                  }}
                >
                  <PlusCircleIcon
                    className="-ml-0.5 mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  ផ្សេងៗ
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mb-2 mt-2"
                  onClick={() => {
                    setOpenMember(true);
                  }}
                >
                  <PlusCircleIcon
                    className="-ml-0.5 mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  សមាជិក
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mb-2"
                  onClick={() => setIsOpenCoupon(true)}
                >
                  <PlusCircleIcon
                    className="-ml-0.5 mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  គ៉ូប៉ុន
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mb-2"
                  onClick={() => setOpenTrainning(true)}
                >
                  <PlusCircleIcon
                    className="-ml-0.5 mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  ហ្វឹកហាត់
                </button>
                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mb-2"
                  onClick={() => HandleHold(details?.end_membership_date)}
                >
                  <PlusCircleIcon
                    className="-ml-0.5 mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  សុំច្បាប់
                </button>

                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mb-2"
                  onClick={() => ShowTransferForm(details?.end_membership_date)}
                >
                  <BiTransfer
                    className="-ml-0.5 mr-1.5 h-4 w-4"
                    aria-hidden="true"
                  />
                  ផ្ទេរសុពលភាព
                </button>
              </div>
            </div>

            <div className="shadow-lg rounded-lg p-2 col-span-5">
              {/* Links */}
              <Tab.Group as="div">
                <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex px-2">
                    <Tab
                      key={1}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-900",
                          "flex-1 whitespace-nowrap border-b-2 px-1 text-base font-medium rounded-lg"
                        )
                      }
                    >
                      សមាជិក
                    </Tab>
                    <Tab
                      key={2}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-900",
                          "flex-1 whitespace-nowrap border-b-2 px-1 text-base font-medium rounded-lg"
                        )
                      }
                    >
                      គ៉ូប៉ុន
                    </Tab>
                    <Tab
                      key={3}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-900",
                          "flex-1 whitespace-nowrap border-b-2 px-1  text-base font-medium rounded-lg"
                        )
                      }
                    >
                      ហ្វឹកហាត់
                    </Tab>
                    <Tab
                      key={4}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-900",
                          "flex-1 whitespace-nowrap border-b-2 px-1 py-2 text-base font-medium rounded-lg"
                        )
                      }
                    >
                      តែជ្រក់
                    </Tab>
                  </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                  <Tab.Panel key={1} className="px-2 pb-2 pt-2">
                    {!loading_payment ? (
                      <MemberPayment
                        member_payment={member_payment?.GetMemberPayment}
                      />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </Tab.Panel>
                  <Tab.Panel key={2} className="px-2 pb-2 pt-2">
                    <div className="grid grid-cols-2 gap-x-4">
                      <p aria-hidden="true" className="mt-1">
                        Shop now 2
                      </p>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel key={3} className="px-2 pb-2 pt-2">
                    {!loading_trainning_payment ? (
                      <TrainningPayment trainning_payment={trainning_payment} />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </Tab.Panel>
                  <Tab.Panel key={4} className="px-2 pb-2 pt-2">
                    {!loading_fruit_payment ? (
                      <FruitPaymentTable fruit_payment={fruit_payment} />
                    ) : (
                      <p>Loading...168</p>
                    )}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      </div>

      <UpdateProfile
        open={open_update}
        setOpen={setOpenUpdate}
        customer_id={details?.customer_id}
        refetch={refetchMemberDetail}
      >
      </UpdateProfile>

      <FruitPayment
        open={open_fruit}
        setOpen={setOpenFruit}
        details={details}
        refechFruitPayment={fruitPaymentRefetch}
        refetchMemberDetail={refetchMemberDetail}
      >
      </FruitPayment>

      <RenewForm
        open_member={open_member}
        setOpenMember={setOpenMember}
        details={details}
        refechMemberPayment={refechMemberPayment}
        refetchMemberDetail={refetchMemberDetail}
      ></RenewForm>

      <CouponPayment
        open_coupon={open_coupon}
        setIsOpenCoupon={setIsOpenCoupon}
        customer_id={ID}
        user_id={parseInt(localStorage.getItem("user_id"))}
        customer_name={details?.customer_name}
        phone={details?.phone}
      >
      </CouponPayment>

      <TrainingPaymentForm
        open_trainning={open_trainning}
        setOpenTrainning={setOpenTrainning}
        customer_id={ID}
        user_id={parseInt(localStorage.getItem("user_id"))}
        customer_name={details?.customer_name}
        phone={details?.phone}
        refetch_trainning_payment={refetch_trainning_payment}
      ></TrainingPaymentForm>

      <HoldForm
        open_hold={open_hold}
        setOpenHold={setOpenHold}
        customer_id={ID}
        old_end={details?.end_membership_date}
      />

      <Transfer open={open_transfer} setOpen={setOpenTransfer} sender_data={details} />

      <WebcamCapture
        open={open_webcam}
        setOpen={setOpenWebcam}
        onCapture={handlePhotoCapture}
        customerId={ID}
      />

      {/* Image Preview Modal */}
      <Transition appear show={open_preview} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpenPreview(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={() => setOpenPreview(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="mt-4">
                    <img
                      className="w-full h-auto rounded-lg"
                      src={
                        details?.image_path 
                          ? `http://${window.location.hostname}:4000${details.image_path}`
                          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt={details?.customer_name || "Profile Preview"}
                    />
                    <p className="mt-4 text-center text-sm text-gray-600">
                      {details?.customer_name}
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </>
  );
};

export default MemberProfile;
