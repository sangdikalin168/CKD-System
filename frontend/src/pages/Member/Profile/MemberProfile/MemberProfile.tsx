import { PencilSquareIcon, BackwardIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CameraIcon,
  ArrowUpTrayIcon,
  PauseIcon,
  ArrowPathRoundedSquareIcon,
  TicketIcon,
  AcademicCapIcon,
  ShoppingBagIcon,
  IdentificationIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const MemberProfile = ({ ID }: any) => {
  const { data, loading: loading_member_detail, refetch: refetchMemberDetail } = useGetCustomerDetailQuery({
    variables: { customerId: ID },
    fetchPolicy: "no-cache",
  });

  const {
    data: member_payment,
    loading: loading_payment,
    refetch: refechMemberPayment,
  } = useGetMemberPaymentQuery({
    variables: { customerId: ID },
    fetchPolicy: "no-cache",
  });

  const {
    data: trainning_payment,
    loading: loading_trainning_payment,
    refetch: refetch_trainning_payment,
  } = useGetTrainningPaymentQuery({
    variables: { customerId: ID },
    fetchPolicy: "no-cache",
  });

  const { data: fruit_payment, loading: loading_fruit_payment, refetch: fruitPaymentRefetch } = useGetFruitPaymentQuery({
    variables: { customerId: ID },
    fetchPolicy: "no-cache",
  });

  const { data: request_data } = useGetHoldRequestQuery({
    variables: { customerId: ID },
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
        variables: { customerId: ID, imagePath: imageSrc },
      });
      if (result.data?.UpdateCustomerPhoto?.success) {
        Notifications("រូបថតបានរក្សាទុកជោគជ័យ", "success");
        refetchMemberDetail();
      } else {
        Notifications("មានបញ្ហាក្នុងការរក្សាទុករូបថត", "error");
      }
    } catch (error) {
      Notifications("មានបញ្ហាក្នុងការរក្សាទុករូបថត", "error");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Notifications("សូមជ្រើសរើសឯកសាររូបភាពតែប៉ុណ្ណោះ", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Notifications("ទំហំឯកសារធំពេក! សូមជ្រើសរើសរូបភាពតូចជាង 5MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        await handlePhotoCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ShowTransferForm = (date: string) => {
    const currentDate = new Date();
    const end_date = new Date(date);
    if (end_date >= currentDate) {
      setOpenTransfer(true);
    } else {
      Notifications("សមាជិកផុតសុពលភាពហើយ", "info");
    }
  };

  const HandleHold = (date: string) => {
    const currentDate = new Date();
    const end_date = new Date(date);
    if (end_date >= currentDate) {
      if (request_data?.GetHoldRequest.length > 0) {
        const end_hold = new Date(request_data?.GetHoldRequest[0].to_date);
        if (end_hold >= currentDate && request_data?.GetHoldRequest[0].checker_status == "Approved" && request_data?.GetHoldRequest[0].process == "Done") {
          Notifications("អតិថិជនកំពុងសុំច្បាប់", "info");
        } else {
          if (request_data?.GetHoldRequest[0].checker_status === "Approved" && request_data?.GetHoldRequest[0].process == "Pending") {
            Notifications("ការសុំច្បាប់បានឯកភាពរួច! សូមចូលមើលតារាងស្នើសុំ", "info");
            return;
          }
          if (request_data?.GetHoldRequest[0].checker_status === "Pending") {
            Notifications("សំណើបានដាក់រួចហើយ សូមអោយថ្នាក់លើពិនិត្យ", "info");
            return;
          }
          setOpenHold(true);
        }
      } else {
        setOpenHold(true);
      }
    } else {
      Notifications("សមាជិកផុតសុពលភាពហើយ", "info");
    }
  };

  const isActive = details?.end_membership_date
    ? new Date(details.end_membership_date) >= new Date()
    : false;

  const photoSrc = details?.image_path
    ? `http://${window.location.hostname}:4000${details.image_path}`
    : null;

  if (loading_fruit_payment && loading_member_detail && loading_trainning_payment && loading_payment)
    return <div>Loading...</div>;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mb-3 gap-1.5"
        onClick={() => window.location.reload()}
      >
        <BackwardIcon className="h-4 w-4" aria-hidden="true" />
        ថយក្រោយ
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ── Left panel ── */}
        <Card className="lg:col-span-1 shadow-md overflow-hidden">
          {/* Avatar header */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-4 pt-6 pb-10" />

          <CardContent className="px-4 pb-5 -mt-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer ring-4 ring-white rounded-full shadow-lg"
                onClick={() => setOpenPreview(true)}
              >
                {photoSrc ? (
                  <img
                    className="h-24 w-24 rounded-full object-cover transition-opacity group-hover:opacity-80"
                    src={photoSrc}
                    alt={details?.customer_name || "Profile"}
                  />
                ) : (
                  <UserCircleIcon className="h-24 w-24 text-gray-300 bg-white rounded-full" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <div className="bg-black/50 rounded-full p-2">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Photo action buttons */}
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1 px-2"
                  onClick={() => setOpenWebcam(true)}
                >
                  <CameraIcon className="h-3.5 w-3.5" />
                  ថតរូប
                </Button>
                <label className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs shadow-sm hover:bg-accent cursor-pointer transition-colors">
                  <ArrowUpTrayIcon className="h-3.5 w-3.5" />
                  បញ្ចូល
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            {/* Member info */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900 truncate">{details?.customer_name}</h2>
                <button
                  onClick={() => setOpenUpdate(true)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Status badge */}
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
                {isActive ? "សក្តិសិទ្ធ" : "ផុតសុពលភាព"}
              </span>

              <div className="mt-3 space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <IdentificationIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500">ID:</span>
                  <span className="font-medium">{ID}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500">ទូរស័ព្ទ:</span>
                  <span className="font-medium">{details?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500">ផុតថ្ងៃ:</span>
                  <span className={`font-medium ${isActive ? "text-green-700" : "text-red-600"}`}>
                    {details?.end_membership_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500">វេន:</span>
                  <span className="font-medium">{details?.shift}</span>
                </div>
              </div>
            </div>

            {/* Action buttons — 2-col grid */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                type="button"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs gap-1 w-full"
                onClick={() => setOpenFruit(true)}
              >
                <ShoppingBagIcon className="h-3.5 w-3.5" />
                ផ្សេងៗ
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs gap-1 w-full"
                onClick={() => setOpenMember(true)}
              >
                <ArrowPathRoundedSquareIcon className="h-3.5 w-3.5" />
                សមាជិក
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs gap-1 w-full"
                onClick={() => setIsOpenCoupon(true)}
              >
                <TicketIcon className="h-3.5 w-3.5" />
                គ៉ូប៉ុន
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs gap-1 w-full"
                onClick={() => setOpenTrainning(true)}
              >
                <AcademicCapIcon className="h-3.5 w-3.5" />
                ហ្វឹកហាត់
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-xs gap-1 w-full"
                onClick={() => HandleHold(details?.end_membership_date)}
              >
                <PauseIcon className="h-3.5 w-3.5" />
                សុំច្បាប់
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-xs gap-1 w-full"
                onClick={() => ShowTransferForm(details?.end_membership_date)}
              >
                <BiTransfer className="h-3.5 w-3.5" />
                ផ្ទេរ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Right panel ── */}
        <Card className="lg:col-span-3 shadow-md">
          <CardContent className="p-0">
            <Tabs defaultValue="member">
              <div className="border-b border-gray-200 px-4 pt-2">
                <TabsList className="bg-transparent h-auto gap-1 p-0">
                  {[
                    { value: "member", label: "សមាជិក" },
                    { value: "coupon", label: "គ៉ូប៉ុន" },
                    { value: "training", label: "ហ្វឹកហាត់" },
                    { value: "fruit", label: "តែជ្រក់" },
                  ].map(({ value, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-1 text-sm font-medium text-gray-600 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
                    >
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-4">
                <TabsContent value="member" className="m-0">
                  {!loading_payment ? (
                    <MemberPayment member_payment={member_payment?.GetMemberPayment} />
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </TabsContent>

                <TabsContent value="coupon" className="m-0">
                  <p className="text-sm text-gray-400 text-center py-8">គ្មានទិន្នន័យ</p>
                </TabsContent>

                <TabsContent value="training" className="m-0">
                  {!loading_trainning_payment ? (
                    <TrainningPayment trainning_payment={trainning_payment} />
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </TabsContent>

                <TabsContent value="fruit" className="m-0">
                  {!loading_fruit_payment ? (
                    <FruitPaymentTable fruit_payment={fruit_payment} />
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <UpdateProfile
        open={open_update}
        setOpen={setOpenUpdate}
        customer_id={details?.customer_id}
        refetch={refetchMemberDetail}
      />

      <FruitPayment
        open={open_fruit}
        setOpen={setOpenFruit}
        details={details}
        refechFruitPayment={fruitPaymentRefetch}
        refetchMemberDetail={refetchMemberDetail}
      />

      <RenewForm
        open_member={open_member}
        setOpenMember={setOpenMember}
        details={details}
        refechMemberPayment={refechMemberPayment}
        refetchMemberDetail={refetchMemberDetail}
      />

      <CouponPayment
        open_coupon={open_coupon}
        setIsOpenCoupon={setIsOpenCoupon}
        customer_id={ID}
        user_id={parseInt(localStorage.getItem("user_id"))}
        customer_name={details?.customer_name}
        phone={details?.phone}
      />

      <TrainingPaymentForm
        open_trainning={open_trainning}
        setOpenTrainning={setOpenTrainning}
        customer_id={ID}
        user_id={parseInt(localStorage.getItem("user_id"))}
        customer_name={details?.customer_name}
        phone={details?.phone}
        refetch_trainning_payment={refetch_trainning_payment}
      />

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

      <Dialog open={open_preview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">រូបភាព</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {photoSrc ? (
              <img
                className="w-full h-auto rounded-lg"
                src={photoSrc}
                alt={details?.customer_name || "Profile Preview"}
              />
            ) : (
              <UserCircleIcon className="w-full h-64 text-gray-200" />
            )}
            <p className="mt-3 text-center text-sm font-medium text-gray-700">
              {details?.customer_name}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemberProfile;
