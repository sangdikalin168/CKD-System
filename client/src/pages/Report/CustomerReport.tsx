import { gql, useQuery } from "@apollo/client";
import { useState } from "react";

const ACTIVE_CUSTOMERS_QUERY = gql`
  query ActiveCustomers {
    activeCustomers {
      total
      customers {
        customer_id
        created_date
        created_by
        customer_code
        customer_name
        phone
        gender
        image_path
        end_membership_date
      }
    }
  }
`;

// GraphQL query to fetch customers whose memberships expire on a specific date
const EXPIRING_CUSTOMERS_QUERY = gql`
  query ExpiringCustomersOnDate($targetDate: String!) {
    expiringCustomersOnDate(targetDate: $targetDate) {
      total
      customers {
        customer_id
        created_date
        customer_name
        phone
        gender
        image_path
        end_membership_date
      }
    }
  }
`;

export const CustomerReport = () => {

  // Query for active customers
  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(ACTIVE_CUSTOMERS_QUERY);


  const [targetDate, setTargetDate] = useState(""); // Store the selected date

  // Query for expiring customers based on targetDate
  const { loading: loadingExpiring, error: errorExpiring, data: dataExpiring } = useQuery(EXPIRING_CUSTOMERS_QUERY, {
    variables: { targetDate },
    skip: !targetDate, // Skip query if no date is provided
  });


  const [showDetails, setShowDetails] = useState(false);

  // Handle loading and error states for both queries
  if (loadingActive || loadingExpiring) return <p className="text-center">Loading...</p>;
  if (errorActive) return <p className="text-center text-red-500">Error: {errorActive.message}</p>;
  if (errorExpiring) return <p className="text-center text-red-500">Error: {errorExpiring.message}</p>;

  // Extract data for both queries
  const { total: totalActive, customers: customersActive } = dataActive?.activeCustomers || { total: 0, customers: [] };
  const { total: totalExpiring, customers: customersExpiring } = dataExpiring?.expiringCustomersOnDate || { total: 0, customers: [] };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1"><span className="text-base font-normal text-gray-400 align-top"></span>{totalActive}</div>
              <div className="text-sm font-medium text-gray-400">Active Members</div>
            </div>
          </div>
          <button
            className="text-blue-500 font-medium text-sm hover:text-blue-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "View details"}
          </button>
        </div>
      </div>

      {/* Conditional Rendering for Table */}
      {showDetails && (
        <div className="bg-white p-6 rounded-md shadow-md">
          <button
            className="text-blue-500 font-medium text-sm hover:text-blue-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "View details"}
          </button>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-left">Gender</th>
                  <th className="py-2 px-4 text-left">Created</th>
                  <th className="py-2 px-4 text-left">EndDate</th>
                </tr>
              </thead>
              <tbody>
                {customersActive.map((customer: any, index: number) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 whitespace-nowrap">{index + 1}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{customer.customer_name}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{customer.phone}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{customer.gender}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{customer.created_date}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{customer.end_membership_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1"><span className="text-base font-normal text-gray-400 align-top"></span>{totalExpiring}</div>
              <div className="text-sm font-medium text-gray-400">Expiring Members</div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="targetDate" className="block text-sm font-medium">Select Expiration Date</label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            className="text-blue-500 font-medium text-sm hover:text-blue-600"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "View details"}
          </button>
        </div>
      </div>

      {targetDate && (
        <>
          <div className="mb-4">
            <div className="text-lg font-semibold">{totalExpiring} Customers Expiring on {targetDate}</div>
            {customersExpiring.length > 0 ? (
              <div className="table-container">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="p-3 text-left border-b">Customer ID</th>
                      <th className="p-3 text-left border-b">Customer Name</th>
                      <th className="p-3 text-left border-b">Phone</th>
                      <th className="p-3 text-left border-b">Gender</th>
                      <th className="p-3 text-left border-b">Membership Expiration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersExpiring.map((customer) => (
                      <tr key={customer.customer_id}>
                        <td className="p-3 border-b">{customer.customer_id}</td>
                        <td className="p-3 border-b">{customer.customer_name}</td>
                        <td className="p-3 border-b">{customer.phone}</td>
                        <td className="p-3 border-b">{customer.gender}</td>
                        <td className="p-3 border-b">{customer.end_membership_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No customers found for the selected expiration date.</p>
            )}
          </div>
        </>
      )}
    </>
  )
}
