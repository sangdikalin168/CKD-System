/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
// @ts-nocheck
import {
  PlusCircleIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import DataTable from "../../Component/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import {
  useCreateCouponPaymentMutation,
  useCreateCustomerPaymentMutation,
  useGetCouponCardLazyQuery,
  useGetCustomerDetailQuery,
  useGetMemberPaymentQuery,
  useGetMemberPriceTableQuery,
  useGetTrainningPaymentQuery,
} from "../../../../generated/graphql";

import { TypeOptions, toast } from "react-toastify";
import { MemberInvoice } from "../../../../components/ComponentToPrint/MemberInvoice";
import { useReactToPrint } from "react-to-print";
import { CouponInvoice } from "../../../../components/ComponentToPrint/CouponInvoice";
import { TrainingPaymentForm } from "../TrainningForm/TrainningForm";
import { MemberPayment } from "./MemberPayment";
import { TrainningPayment } from "./TrainningPayment";

const notify = (
  message: string,
  auto_Close: boolean | number,
  toastType: TypeOptions
) => {
  if (!toast.isActive("alert")) {
    toast(message, {
      autoClose: auto_Close ? 500 : false,
      toastId: "alert",
      type: toastType,
    });
  }
};

const date_time_format = (date_time: Date) => {
  const date = new Date(date_time);
  return date.toLocaleDateString("fr-CA");
};

type PriceTable = {
  id: number;
  name: string;
  age: string;
  member_type: string;
  month_qty: number;
  price: number;
  shift: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const MemberProfile = ({ ID }: any) => {
  const columnHelperPriceTable = createColumnHelper<PriceTable>();
  const columns_price_table = [
    columnHelperPriceTable.accessor((row) => row.name, {
      id: "ឈ្មោះ Promotion",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelperPriceTable.accessor((row) => row.age, {
      id: "វ័យ",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelperPriceTable.accessor((row) => row.member_type, {
      id: "សមាជិក",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelperPriceTable.accessor((row) => row.month_qty, {
      id: "ចំនួនខែ",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelperPriceTable.accessor((row) => row.shift, {
      id: "វេន",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelperPriceTable.accessor((row) => row.price, {
      id: "តម្លៃ",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelperPriceTable.accessor((row) => row.id, {
      id: "Action",
      cell: (info) => (
        <div className="flex">
          {
            <>
              <span className="hidden sm:block">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => {
                    setIsShowConfirmModal(true);
                    const row = info.row.original;
                    setMonthQty(row.month_qty);
                    setPromotion(row.name);
                    setPrice(row.price);
                    setShift(row.shift);
                  }}
                >
                  <CurrencyDollarIcon
                    className="h-4 w-4 text-green-500 hover:bg-red-500"
                    aria-hidden="true"
                  />
                </button>
              </span>
            </>
          }
        </div>
      ),
      header: () => <span>Action</span>,
      footer: (info) => info.column.id,
    }),
  ];

  const [open_member, setOpenMember] = useState(false);
  const cancelButtonRef = useRef(null);
  const { data: price_table } = useGetMemberPriceTableQuery();

  const { data, refetch } = useGetCustomerDetailQuery({
    variables: {
      customerId: ID,
    },
  });

  const { data: member_payment, loading: loading_payment } =
    useGetMemberPaymentQuery({
      variables: {
        customerId: ID,
      },
    });

  const {
    data: trainning_payment,
    loading: loading_trainning_payment,
    refetch: refetch_trainning_payment,
  } = useGetTrainningPaymentQuery({
    variables: {
      customerId: ID,
    },
  });

  const details = data?.GetCustomerDetail[0];

  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [month_qty, setMonthQty] = useState(1);
  const [shift, setShift] = useState("");
  const [price, setPrice] = useState(0);
  const [promotion, setPromotion] = useState("");
  const [open_coupon, setIsOpenCoupon] = useState(false);
  const [open_trainning, setOpenTrainning] = useState(false);

  const FilterPriceTableByMonth = (month_qty: number) => {
    const result = price_table?.GetMemberPriceTable.filter(
      (p) => p.month_qty == month_qty
    );
    setMemberPriceTable(result);
  };
  const FilterPriceTableByAge = (age: string) => {
    const result = member_price_table.filter((p) => p.age == age);
    setMemberPriceTable(result);
  };

  const [member_price_table, setMemberPriceTable] = useState([]);

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
                    FilterPriceTableByMonth(1);
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

      <Transition.Root show={open_member} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpenMember}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="">
                      <div className="mt-3 text-center">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          តារាងតម្លៃសមាជិក
                        </Dialog.Title>
                        <div className="mt-2">
                          {!isShowConfirmModal ? (
                            <>
                              <div className="space-x-2">
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByAge("ចាស់")}
                                >
                                  ចាស់
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByAge("ក្មេង")}
                                >
                                  ក្មេង
                                </button>
                              </div>

                              <div className="space-x-2">
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByMonth(1)}
                                >
                                  1ខែ
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByMonth(1.5)}
                                >
                                  1.5ខែ
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByMonth(3)}
                                >
                                  3ខែ
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByMonth(6)}
                                >
                                  6ខែ
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => FilterPriceTableByMonth(12)}
                                >
                                  12ខែ
                                </button>
                              </div>
                              <DataTable
                                columns={columns_price_table}
                                data={member_price_table}
                              />
                            </>
                          ) : (
                            <>
                              <ConfirmModal
                                setIsShowConfirmModal={setIsShowConfirmModal}
                                old_end={details?.end_membership_date}
                                month_qty={month_qty}
                                promotion={promotion}
                                shift={shift}
                                price={price}
                                customer_id={ID}
                                user_id={parseInt(
                                  localStorage.getItem("user_id")
                                )}
                                customer_name={details?.customer_name}
                                phone={details?.phone}
                                refetch={refetch}
                                setOpenMember={setOpenMember}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        setOpenMember(false);
                        setIsShowConfirmModal(false);
                      }}
                    >
                      បោះបង់
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

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

const ConfirmModal = (props: any) => {
  const datetime_format = (date_time: Date) => {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA") + " " + date.toLocaleTimeString();
  };

  const getRenewalDate = (effectiveDate: Date, month_qty: number) => {
    // Get the current date.
    if (month_qty == 1.5) {
      const today = new Date();
      let duration = 0;
      if (effectiveDate < today) {
        duration = today.getMonth() - today.getMonth() + 1;
        // Add the duration to the effective date to get the next renewal date.
        const renewalDate = new Date(today);
        renewalDate.setDate(renewalDate.getDate() + 15);
        renewalDate.setMonth(renewalDate.getMonth() + duration);
        renewalDate.setFullYear(renewalDate.getFullYear() + duration / 12);
        return renewalDate;
      } else {
        duration = today.getMonth() - effectiveDate.getMonth() + month_qty;
        // Add the duration to the effective date to get the next renewal date.
        const renewalDate = new Date(effectiveDate);
        renewalDate.setDate(renewalDate.getDate() + 15);
        renewalDate.setMonth(renewalDate.getMonth() + month_qty);
        renewalDate.setFullYear(renewalDate.getFullYear() + month_qty / 12);
        return renewalDate;
      }
    }

    const today = new Date();
    let duration = 0;
    if (effectiveDate < today) {
      duration = today.getMonth() - today.getMonth() + month_qty;
      // Add the duration to the effective date to get the next renewal date.
      const renewalDate = new Date(today);
      renewalDate.setMonth(renewalDate.getMonth() + duration);
      //renewalDate.setFullYear(renewalDate.getFullYear() + duration / 12);
      return renewalDate;
    } else {
      duration = today.getMonth() - effectiveDate.getMonth() + month_qty;
      // Add the duration to the effective date to get the next renewal date.
      const renewalDate = new Date(effectiveDate);
      renewalDate.setMonth(renewalDate.getMonth() + month_qty);
      //renewalDate.setFullYear(renewalDate.getFullYear() + month_qty / 12);
      return renewalDate;
    }
  };

  const effectiveDate = new Date(props.old_end);
  const renewalDate = getRenewalDate(effectiveDate, props.month_qty);
  const [createMemberPayment] = useCreateCustomerPaymentMutation();

  const [payment_id, setPaymentID] = useState(0);

  const handleSubmit = async () => {
    const result = await createMemberPayment({
      variables: {
        monthQty: props.month_qty,
        shift: props.shift,
        newEnd: date_time_format(renewalDate),
        oldEnd: props.old_end,
        price: props.price,
        promotion: props.promotion,
        customerId: props.customer_id,
        userId: props.user_id,
      },
    });

    if (result.data?.CreateCustomerPayment.success) {
      setPaymentID(result.data.CreateCustomerPayment.payment_id);
      notify("Success", true, "success");
      props.refetch();
      props.setOpenMember(false);
      return;
    }
    notify("Failed", true, "error");
  };

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint1 = async (target: HTMLIFrameElement) => {
    return new Promise(() => {
      console.log("forwarding print request to the main process...");
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.electronAPI.printComponent(url, (response: any) => {
        console.log("Main: ", response);
      });
      // console.log('Main: ', data);
    });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: async (printIframe: HTMLIFrameElement) => {
      // Do whatever you want here, including asynchronous work
      await handlePrint1(printIframe);
    },
  });
  const buttonRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // This function will be called after the component re-renders
    if (payment_id > 0) {
      buttonRef.current.click();
      props.setIsShowConfirmModal(false);
    }
  }, [payment_id]);

  return (
    <>
      <button
        className="hidden"
        ref={buttonRef}
        type="button"
        onClick={handlePrint}
      >
        Print
      </button>
      <p className="text-lg font-semibold leading-6 text-gray-900">
        សុពលភាពចាស់: {props.old_end}
      </p>
      <p className="text-lg font-semibold leading-6 text-gray-900 mb-2 ">
        ថ្ងៃបង់ប្រាក់បន្ទាប់: {date_time_format(renewalDate)}
      </p>
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
        onClick={() => props.setIsShowConfirmModal(false)}
      >
        បោះបង់
      </button>
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
        onClick={handleSubmit}
      >
        យល់ព្រម
      </button>

      <div className="hidden1">
        <MemberInvoice
          ref={componentRef}
          invoice_id={payment_id}
          payment_date={datetime_format(new Date())}
          cashier={localStorage.getItem("display_name")}
          c_name={props.customer_name}
          phone={props.phone}
          promotion={props.promotion}
          price={props.price}
          old_end={props.old_end}
          new_end={date_time_format(renewalDate)}
          shift={props.shift}
        />
      </div>
    </>
  );
};

const CouponPayment = (props: any) => {
  const cancelButtonRef = useRef(null);
  //const buttonRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const inputEl = useRef(null);

  const [findCouponCard, { data, loading, refetch }] =
    useGetCouponCardLazyQuery({ fetchPolicy: "network-only" });

  const FindCoupon = async (code: string) => {
    await findCouponCard({
      variables: {
        couponCode: code,
      },
    });
    inputEl.current.select();
  };

  const [coupon_code, setCouponCode] = useState("");
  const [payment_id, setPaymentID] = useState("");

  const [createCouponPayment] = useCreateCouponPaymentMutation();

  const CreateCouponPayment = async () => {
    const result = await createCouponPayment({
      variables: {
        userId: props.user_id,
        customerId: props.customer_id,
        cardName: data?.GetCouponCard[0].card_name,
        price: data?.GetCouponCard[0].price,
        quantity: data?.GetCouponCard[0].quantity,
        couponCode: coupon_code,
      },
    });

    if (result.data?.CreateCouponPayment.success) {
      props.setIsOpenCoupon(false);
      setPaymentID(result.data.CreateCouponPayment.payment_id);
      return;
    }

    notify("Coupon Payment Error", true, "error");
  };

  const handlePrint1 = async (target: HTMLIFrameElement) => {
    return new Promise(() => {
      console.log("forwarding print request to the main process...");
      const data = target.contentWindow.document.documentElement.outerHTML;
      const blob = new Blob([data], { type: "text/html; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.electronAPI.printComponent(url, (response: any) => {
        console.log("Main: ", response);
      });
      // console.log('Main: ', data);
    });
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    print: async (printIframe: HTMLIFrameElement) => {
      // Do whatever you want here, including asynchronous work
      await handlePrint1(printIframe);
    },
  });

  useEffect(() => {
    // This function will be called after the component re-renders
    if (payment_id > 0) {
      buttonRef.current?.click();
      refetch();
    }
  }, [payment_id]);

  return (
    <>
      <button
        className="hidden"
        ref={buttonRef}
        type="button"
        onClick={handlePrint}
      >
        Print
      </button>
      <Transition.Root show={props.open_coupon} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={props.setIsOpenCoupon}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="">
                      <div className="mt-3 text-center">
                        <div className="mt-2">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              សូមបញ្ចុលលេខកូដគូប៉ុន
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                required
                                ref={inputEl}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            className="mt-2 flex rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => FindCoupon(coupon_code)}
                          >
                            {" "}
                            <MagnifyingGlassIcon className="h-5 w-5" />
                            ស្វែងរក
                          </button>

                          <div>
                            {!loading && data ? (
                              <>
                                {data.GetCouponCard.length > 0 ? (
                                  <>
                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                      Card Name:{" "}
                                      {data?.GetCouponCard[0].card_name}
                                    </p>
                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                      តម្លៃ: {data?.GetCouponCard[0].price}$
                                    </p>
                                    <button
                                      type="button"
                                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                      onClick={() => CreateCouponPayment()}
                                    >
                                      លក់
                                    </button>
                                  </>
                                ) : (
                                  <div>Coupon Not Found!!!</div>
                                )}
                              </>
                            ) : (
                              <div>Loading...</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        props.setIsOpenCoupon(false);
                      }}
                    >
                      បោះបង់
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden">
        <div>
          {!loading && data ? (
            <>
              {data.GetCouponCard.length > 0 ? (
                <>
                  <CouponInvoice
                    ref={componentRef}
                    invoice_id={payment_id}
                    payment_date={date_time_format(new Date())}
                    cashier={localStorage.getItem("display_name")}
                    c_name={props.customer_name}
                    phone={props.phone}
                    promotion={data?.GetCouponCard[0].card_name || "null"}
                    price={data?.GetCouponCard[0].price || "null"}
                  />
                </>
              ) : (
                <div>Coupon Not Found!!!</div>
              )}
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberProfile;
