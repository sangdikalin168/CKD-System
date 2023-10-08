/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
// @ts-nocheck
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";
import {
  useGetCustomerDetailQuery,
  useGetMemberPaymentQuery,
  useGetTrainningPaymentQuery,
} from "../../../../generated/graphql";
import { TrainingPaymentForm } from "../TrainningForm/TrainningForm";
import { MemberPayment } from "./MemberPayment";
import { TrainningPayment } from "./TrainningPayment";
import { CouponPayment } from "../CouponForm/CouponForm";
import { RenewForm } from "../RenewForm/RenewForm";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const MemberProfile = ({ ID }: any) => {
  const { data, refetch: refetchMemberDetail } = useGetCustomerDetailQuery({
    variables: {
      customerId: ID,
    },
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

  const details = data?.GetCustomerDetail[0];

  const [open_coupon, setIsOpenCoupon] = useState(false);
  const [open_trainning, setOpenTrainning] = useState(false);
  const [open_member, setOpenMember] = useState(false);

  return (
    <>
      <div className="bg-white p-4 rounded-lg mb-4 h-screen">
        <div className="border-b border-gray-900/10">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-6">
            <div className="shadow-lg rounded-lg p-2">
              <img
                className="h-24 w-24 flex-none rounded-full bg-gray-50"
                src={
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  លេខ ID: {ID}
                </p>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  ឈ្មោះ: {details?.customer_name}
                </p>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  លេខទូរស័ព្ទ: {details?.phone}
                </p>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  ថ្ងៃបង់ប្រាក់: {details?.end_membership_date}
                </p>
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  វេន: {details?.shift}
                </p>
                <button
                  type="button"
                  className="w-full inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-green-500 mb-2 mt-2"
                  onClick={() => {
                    setOpenMember(true);
                    //FilterPriceTableByMonth(1);
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
                      Tab 4
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
                    <div className="grid grid-cols-2 gap-x-4">
                      <p aria-hidden="true" className="mt-1">
                        Shop now 4
                      </p>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default MemberProfile;
