import { EyeIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import DataTable from "../../components/DataTable/DataTable";
import {
  useCreateCustomerMutation,
  useGetCustomersQuery,
} from "../../generated/graphql";
import CreateMember from "./CreateMember";
import JWTManager from "../../utils/jwt";
import MemberProfile from "./Profile/MemberProfile/MemberProfile";
import { TypeOptions, toast } from "react-toastify";
import { Button } from "@/components/ui/button";

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

type Customer = {
  customer_id: number;
  created_date: string;
  created_by: number;
  customer_code: string;
  customer_name: string;
  phone: string;
  gender: string;
  image_path: string;
  fingerprint: string;
  end_membership_date: string;
  coupon_remain_qty: number;
  key_status: string;
  towel_status: string;
};

export const Member = () => {
  const columnHelper = createColumnHelper<Customer>();
  const columns = [
    columnHelper.accessor((row) => row.customer_id, {
      id: "ID",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.customer_name, {
      id: "Name",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.phone, {
      id: "Phone",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.end_membership_date, {
      id: "End Date",
      cell: (info) => info.getValue(),
      header: (info) => <span>{info.column.id}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.customer_id, {
      id: "Action",
      cell: (info) => (
        <div className="flex">
          {
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setShowProfile(!showProfile);
                  setCustomerID(info.row.original.customer_id);
                }}
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            </>
          }
        </div>
      ),
      header: () => <span>Action</span>,
      footer: (info) => info.column.id,
    }),
  ];

  const add_button = (
    <Button onClick={() => setShowCreate(!showCreate)}>
      <PlusCircleIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
      Add
    </Button>
  );

  const [customer_id, setCustomerID] = useState(0);
  const [data_table, setData_table] = useState<Customer[]>(() => []);
  const {
    data,
    loading: member_loading,
    refetch,
  } = useGetCustomersQuery({ fetchPolicy: "no-cache" });
  const [createCustomer] = useCreateCustomerMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSubmit = async (data: any) => {
    // Process and insert the data using an API call or perform any necessary actions
    const { data: result } = await createCustomer({
      variables: {
        customerName: data.customer_name,
        phone: data.phone,
        gender: data.gender,
        createdBy: JWTManager.getUserId() as number,
      },
    });

    if (result?.CreateCustomer.success) {
      notify("Created Succes", true, toast.TYPE.SUCCESS);
      setShowCreate(false);
      refetch();
    }
    notify(result?.CreateCustomer.message, true, toast.TYPE.INFO);
  };

  useEffect(() => {
    if (data) {
      setData_table(data.GetCustomers);
    }
  }, [data]);

  return (
    <>
      {!member_loading ? (
        <div>
          {showCreate && (
            <CreateMember setShow={setShowCreate} onSubmit={handleSubmit} />
          )}
          {showProfile && <MemberProfile ID={customer_id} />}
          {!showProfile && (
            <DataTable
              columns={columns}
              data={data_table}
              button={add_button}
            />
          )}
        </div>
      ) : (
        <LoadingPage message={"Loading"} />
      )}
    </>
  );
};
