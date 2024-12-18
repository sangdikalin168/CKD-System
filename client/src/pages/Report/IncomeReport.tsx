import { useEffect, useState } from "react";
import React from "react";
import { gql, useLazyQuery } from "@apollo/client";

import { DateTimePicker } from "../../components/DateTimePicker/DateTimePicker";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
// import { ItemDetailModal } from "./pages/sportclub/ItemDetailModal";

const GET_TICKETPAYMENT = gql`
  query GetTicketPayment($dateFrom: String!, $dateTo: String!, $userId: Float!) {
    GetTicketPayment(dateFrom: $dateFrom, dateTo: $dateTo, userId: $userId) {
      payment_date
      price
      qty
    }
  }
`;

const GET_MEMBER_PAYMENT = gql`
  query GetMemberPayments($dateFrom: String!, $dateTo: String!, $userId: Float!) {
    GetMemberPayments(dateFrom: $dateFrom, dateTo: $dateTo, userId: $userId) {
      promotion
      price
      qty
    }
  }
`;

const GET_COUPON_PAYMENT = gql`
  query GetCouponPayments($dateFrom: String!, $dateTo: String!, $userId: Float!) {
    GetCouponPayments(dateFrom: $dateFrom, dateTo: $dateTo, userId: $userId) {
      price
      qty
      card_name
    }
  }
`;

const GET_TRAINNING_PAYMENT = gql`
  query GetTrainningPayments($dateFrom: String!, $userId: Float!, $dateTo: String!) {
    GetTrainningPayments(dateFrom: $dateFrom, userId: $userId, dateTo: $dateTo) {
      promotion
      price
      qty
    }
  }
`;

const GET_SELLER = gql`
  query GetSeller($dateFrom: String!, $dateTo: String!) {
    GetSeller(dateFrom: $dateFrom, dateTo: $dateTo) {
      user_id
      display_name
      phone
      role
    }
  }
`;

const GET_MEMBER_PAYMENT_DETAIL = gql`
  query GetMemberPaymentDetail($dateTo: String!, $dateFrom: String!) {
  GetMemberPaymentDetail(dateTo: $dateTo, dateFrom: $dateFrom) {
    customer_name
    promotion
  }
}
`;

const GET_COUPON_PAYMENT_DETAIL = gql`
  query GetCouponPaymentDetails($dateTo: String!, $dateFrom: String!) {
  GetCouponPaymentDetails(dateTo: $dateTo, dateFrom: $dateFrom) {
    customer_name
    card_name
  }
}
`;

const GET_TRAINNING_PAYMENT_DETAIL = gql`
  query GetTrainningPaymentDetail($dateTo: String!, $dateFrom: String!) {
  GetTrainningPaymentDetail(dateTo: $dateTo, dateFrom: $dateFrom) {
    customer_name
    promotion
  }
}
`;

function IncomeReport() {

  const [data, setData] = React.useState(() => []);
  const [GetTicketPayment] = useLazyQuery(GET_TICKETPAYMENT, {
    fetchPolicy: "no-cache",
  });
  const [GetMemberPayment] = useLazyQuery(GET_MEMBER_PAYMENT, {
    fetchPolicy: "no-cache",
  });
  const [GetTrainningPayment] = useLazyQuery(GET_TRAINNING_PAYMENT, {
    fetchPolicy: "no-cache",
  });
  const [GetCouponPayment] = useLazyQuery(GET_COUPON_PAYMENT, {
    fetchPolicy: "no-cache",
  });
  const [GetMemberPaymentDetail, { data: member_payments }] = useLazyQuery(GET_MEMBER_PAYMENT_DETAIL, {
    fetchPolicy: "no-cache",
  });

  const [GetCouopnPaymentDetail, { data: coupon_payments }] = useLazyQuery(GET_COUPON_PAYMENT_DETAIL, {
    fetchPolicy: "no-cache",
  });

  const [GetTrainningPaymentDetail, { data: trainning_payments }] = useLazyQuery(GET_TRAINNING_PAYMENT_DETAIL, {
    fetchPolicy: "no-cache",
  });




  function date_time_format(date_time: Date) {
    const date = new Date(date_time);
    return date.toLocaleDateString("fr-CA");
  }

  const CombineData = async (seller_id: number) => {
    setLoading(true);

    const tmp_report: any = [];

    const reuslt1 = await GetTicketPayment({
      variables: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
        userId: seller_id,
      },
    });
    if (!reuslt1.loading) {
      await reuslt1.data.GetTicketPayment.map((data: any) => {
        tmp_report.push({
          item: "សំបុត្រ​ " + data.price + " $",
          price: data.price,
          qty: data.qty,
          total: data.qty * data.price,
        });
      });
    }

    const reuslt2 = await GetMemberPayment({
      variables: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
        userId: seller_id,
      },
    });

    if (!reuslt2.loading) {
      await reuslt2.data.GetMemberPayments.map((data: any) => {
        tmp_report.push({
          item: data.promotion,
          price: data.price,
          qty: data.qty,
          total: data.qty * data.price,
        });
      });
    }

    const result3 = await GetCouponPayment({
      variables: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
        userId: seller_id,
      },
    });

    if (!result3.loading) {
      await result3.data.GetCouponPayments.map((data: any) => {
        tmp_report.push({
          item: data.card_name,
          price: data.price,
          qty: data.qty,
          total: data.qty * data.price,
        });
      });
    }

    const result4 = await GetTrainningPayment({
      variables: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
        userId: seller_id,
      },
    });

    if (!result4.loading) {
      await result4.data.GetTrainningPayments.map((data: any) => {
        tmp_report.push({
          item: data.promotion,
          price: data.price,
          qty: data.qty,
          total: data.qty * data.price,
        });
      });
    }

    const sum = tmp_report.reduce((acc: any, object: any) => {
      return acc + object.total;
    }, 0);

    SetTotal(sum);
    setData(tmp_report);
    setLoading(false);
  };

  const [total, SetTotal] = useState(0);

  const [showDateTo, setShowDateTo] = useState(false);
  const handleCloseDateTo = (state: boolean) => {
    setShowDateTo(state);
  };
  const [selectedDateTo, setSelectedDateTo] = useState(
    date_time_format(new Date())
  );

  const handleChangeDateTo = (selectedDate: Date) => {
    setLoading(true);
    setSelectedDateTo(date_time_format(selectedDate));
    setLoading(false);
  };

  const [showDateFrom, setShowDateFrom] = useState(false);
  const handleCloseDateFrom = (state: boolean) => {
    setShowDateFrom(state);
  };
  const [selectedDateFrom, setSelectedDateFrom] = useState(
    date_time_format(new Date())
  );
  const handleChangeDateFrom = (selectedDate: Date) => {
    setLoading(true);
    setSelectedDateFrom(date_time_format(selectedDate));
    setLoading(false);
  };

  const [getSeller, { loading: seller_loading }] = useLazyQuery(GET_SELLER, {
    fetchPolicy: "no-cache",
  });

  const [sale_detail, setSaleDetail] = useState([])


  const [loading, setLoading] = useState(false);

  const GetSeller = async () => {
    const result = await getSeller({
      variables: {
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
      },
    });

    const arr1 = getUniqueListBy(result.data.GetSeller, "user_id");
    setSeller(arr1);
  };

  function getUniqueListBy(arr: object[], key: string) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }
  const [seller, setSeller] = useState([]);

  useEffect(() => {
    //detect date_from and date_to changed to get new data
    const intervalId = setInterval(() => {
      GetSeller();
      // Fetch Seller every 1 seconds
    }, 5000);
    return () => clearInterval(intervalId);
  }, [selectedDateFrom, selectedDateTo]);

  useEffect(() => {
    setLoading(true);
    CombineData(0);
  }, []);

  return (
    <>
      {!loading ? (
        <div className="select-none">
          {/* CheckBox */}

          <div className="p-2">
            <legend className="text-sm font-semibold leading-6 text-gray-900">
              ជ្រើសរើសអ្នកលក់
            </legend>
            <div className="space-x-2 flex">
              {seller.map((seller: any) => {
                return (
                  <div key={seller.user_id}>
                    <button
                      type="button"
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                      onClick={() => CombineData(parseInt(seller.user_id))}
                    >
                      {seller.display_name}
                    </button>
                  </div>
                );
              })}

              <div>
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  onClick={() => CombineData(0)}
                >
                  ទាំងអស់
                </button>
              </div>
            </div>
          </div>

          {/* DateTime Picker */}
          <div className="space-y-2 sapce-x-2 p-2">

            <div className="col-span-1 mr-1">
              <DateTimePicker
                onChange={handleChangeDateFrom}
                value={selectedDateFrom}
                show={showDateFrom}
                setShow={handleCloseDateFrom}
              />
            </div>

            <div className="col-span-1 mr-1">
              <DateTimePicker
                onChange={handleChangeDateTo}
                value={selectedDateTo}
                show={showDateTo}
                setShow={handleCloseDateTo}
              />
            </div>
          </div>

          <div className="p-2 flex space-x-2">
            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              onClick={() => GetMemberPaymentDetail({
                variables: {
                  dateTo: selectedDateTo,
                  dateFrom: selectedDateFrom
                }
              })}
            >
              សមាជិក
            </button>

            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              គូប៉ុន
            </button>

            <button
              type="button"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              ហ្វឹកហាត់
            </button>
          </div>

          <div className="p-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-300">
                <tr>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ទំនិញ</th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ចំនួន</th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">តម្លៃ</th>
                  <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">សរុប</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map((payment, index) => {
                    return (
                      <tr key={index} className="odd:bg-white even:bg-gray-100 text-left">
                        <td className="px-2 py-2 text-left text-sm">{payment.item}</td>
                        <td className="px-2 py-2 text-left text-sm">{payment.qty}</td>
                        <td className="px-2 py-2 text-left text-sm">${payment.price}</td>
                        <td className="px-2 py-2 text-left text-sm">${payment.total}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
              <tfoot className="bg-gray-300">
                <tr className="text-md font-bold">
                  <td className="px-1 py-1">សរុប $ {total} </td>
                  <td className="px-1 py-1"></td>
                  <td className="px-1 py-1"></td>
                  <td className="px-1 py-1"></td>
                </tr>
              </tfoot>
            </table>
          </div>


          {/* Member Details Table */}
          <>
            {
              member_payments ? (
                <div className="p-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-300">
                      <tr>
                        <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ឈ្មោះ</th>
                        <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        member_payments.GetMemberPaymentDetail.map((payment, index) => {
                          return (
                            <tr key={index} className="odd:bg-white even:bg-gray-100 text-left">
                              <td className="px-2 py-2 text-left text-sm">{payment.customer_name}</td>
                              <td className="px-2 py-2 text-left text-sm">{payment.promotion}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              ) : null
            }

          </>

          {/* Member Details Table */}
          <>
            {
              member_payments ? (
                <div className="p-2">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-300">
                      <tr>
                        <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">ឈ្មោះ</th>
                        <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        member_payments.GetMemberPaymentDetail.map((payment, index) => {
                          return (
                            <tr key={index} className="odd:bg-white even:bg-gray-100 text-left">
                              <td className="px-2 py-2 text-left text-sm">{payment.customer_name}</td>
                              <td className="px-2 py-2 text-left text-sm">{payment.promotion}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              ) : null
            }

          </>
        </div >
      ) :
        <LoadingPage message={"Loading"} />
      }
    </>
  );
}

export default IncomeReport;
