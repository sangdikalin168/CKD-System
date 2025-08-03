// To use PDF export, run:
// npm install jspdf jspdf-autotable
// To use html2pdf.js for Unicode/Khmer PDF export:
// npm install html2pdf.js
import html2pdf from "html2pdf.js";
const CUSTOMER_SCAN_REPORT_QUERY = gql`
  query CustomerScanReport($toDate: String!, $fromDate: String!, $memberId: Float!) {
    customerScanReport(toDate: $toDate, fromDate: $fromDate, memberId: $memberId) {
      member_id
      FromDate
      ToDate
      ScanLog {
        scanDate
      }
    }
  }
`;
import React, { useState, useRef } from "react";
import { gql, useQuery } from "@apollo/client";

const CUSTOMERS = gql`
  query GetCustomers {
    GetCustomers{
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
`;

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
  // Ref for scan log section
  const scanLogRef = useRef<HTMLDivElement>(null);


  // Tab state: 'active', 'expiring', or 'scan'
  const [selectedTab, setSelectedTab] = useState<'active' | 'expiring' | 'scan'>('active');

  // Query for all customers
  const { loading: loadingCustomers, error: errorCustomers, data: dataCustomers } = useQuery(CUSTOMERS);

  // Debounced search state for Scan Report
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  // Query for scan report (only runs if all fields are filled and search is clicked)
  const {
    loading: loadingScan,
    error: errorScan,
    data: dataScan
  } = useQuery(CUSTOMER_SCAN_REPORT_QUERY, {
    variables: {
      memberId: selectedCustomer?.customer_id,
      fromDate,
      toDate
    },
    skip: !selectedCustomer || !fromDate || !toDate || !searchClicked,
    fetchPolicy: "network-only"
  });

  // Debounce effect
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Filter customers for dropdown
  const customerList = dataCustomers?.GetCustomers || [];
  const filteredCustomers = debouncedValue
    ? customerList.filter((c: any) => {
      const val = debouncedValue.toLowerCase();
      return (
        c.customer_id?.toString().includes(val) ||
        c.customer_name?.toLowerCase().includes(val) ||
        c.phone?.toLowerCase().includes(val)
      );
    })
    : [];

  // Query for active customers
  const { loading: loadingActive, error: errorActive, data: dataActive } = useQuery(ACTIVE_CUSTOMERS_QUERY);
  const [showDetails, setShowDetails] = useState(false);

  const [targetDate, setTargetDate] = useState(""); // Store the selected date
  // Query for expiring customers based on targetDate
  const { loading: loadingExpiring, error: errorExpiring, data: dataExpiring } = useQuery(EXPIRING_CUSTOMERS_QUERY, {
    variables: { targetDate },
    skip: !targetDate, // Skip query if no date is provided
  });

  // Handle loading and error states for both queries
  if ((selectedTab === 'active' && loadingActive) || (selectedTab === 'expiring' && loadingExpiring)) return <p className="text-center">Loading...</p>;
  if (selectedTab === 'active' && errorActive) return <p className="text-center text-red-500">Error: {errorActive.message}</p>;
  if (selectedTab === 'expiring' && errorExpiring) return <p className="text-center text-red-500">Error: {errorExpiring.message}</p>;

  // Extract data for both queries
  const { total: totalActive, customers: customersActive } = dataActive?.activeCustomers || { total: 0, customers: [] };
  const { total: totalExpiring, customers: customersExpiring } = dataExpiring?.expiringCustomersOnDate || { total: 0, customers: [] };

  return (
    <>
      {/* Tab Buttons */}
      <div className="flex mb-6 gap-2">
        <button
          className={`px-4 py-2 rounded-t-md font-semibold border-b-2 ${selectedTab === 'active' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
          onClick={() => setSelectedTab('active')}
        >
          Active Members
        </button>
        <button
          className={`px-4 py-2 rounded-t-md font-semibold border-b-2 ${selectedTab === 'expiring' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
          onClick={() => setSelectedTab('expiring')}
        >
          Expiring Members
        </button>
        <button
          className={`px-4 py-2 rounded-t-md font-semibold border-b-2 ${selectedTab === 'scan' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 bg-gray-100'}`}
          onClick={() => setSelectedTab('scan')}
        >
          Scan Report
        </button>
      </div>
      {/* Scan Report Tab */}
      {selectedTab === 'scan' && (
        <div className="bg-white p-6 rounded-md shadow-md max-w-2xl mx-auto">
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="block text-sm font-medium mb-1">Customer Search</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Type ID, Name or Phone..."
                value={searchValue}
                onChange={e => {
                  setSearchValue(e.target.value);
                  setShowDropdown(true);
                  setSelectedCustomer(null);
                  setSearchClicked(false);
                }}
                onFocus={() => setShowDropdown(true)}
                autoComplete="off"
              />
              {/* Dropdown */}
              {showDropdown && debouncedValue && filteredCustomers.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredCustomers.map((c: any) => (
                    <li
                      key={c.customer_id}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setSearchValue(c.customer_name + ' (' + c.customer_id + ')');
                        setShowDropdown(false);
                        setSearchClicked(false);
                      }}
                    >
                      {c.customer_name} ({c.customer_id}) - {c.phone}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={fromDate}
                onChange={e => {
                  setFromDate(e.target.value);
                  setSearchClicked(false);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={toDate}
                onChange={e => {
                  setToDate(e.target.value);
                  setSearchClicked(false);
                }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!selectedCustomer || !fromDate || !toDate}
              onClick={() => setSearchClicked(true)}
            >
              Search
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={
                !dataScan ||
                !dataScan.customerScanReport ||
                !dataScan.customerScanReport.ScanLog.length
              }
              onClick={() => {
                if (!scanLogRef.current) {
                  alert('No scan log to export.');
                  return;
                }
                // Sanitize name for filename (remove special chars, spaces to _)
                const name = selectedCustomer?.customer_name
                  ? selectedCustomer.customer_name.replace(/[^\w\d\u1780-\u17FF]+/g, '_')
                  : 'customer';
                const id = selectedCustomer?.customer_id || '';
                const filename = `scan-log-${name}-${id}.pdf`;
                html2pdf()
                  .set({
                    margin: 10,
                    filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  })
                  .from(scanLogRef.current)
                  .save();
              }}
            >
              Export to PDF
            </button>
          </div>
          {/* Scan results */}
          <div className="mt-6" ref={scanLogRef}>
            {loadingScan && <p className="text-gray-400 text-center">Loading scan results...</p>}
            {errorScan && <p className="text-red-500 text-center">Error: {errorScan.message}</p>}
            {dataScan && dataScan.customerScanReport && (
              <div>
                <div className="mb-2 font-semibold text-center">Scan Log for {selectedCustomer?.customer_name} ({dataScan.customerScanReport.FromDate} to {dataScan.customerScanReport.ToDate})</div>
                {dataScan.customerScanReport.ScanLog.length > 0 ? (
                  <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                      <tr>
                        <th className="p-3 text-left border-b">Scan Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataScan.customerScanReport.ScanLog.map((log: any, idx: number) => {
                        // Format date: dd-mm-yyyy hh:mm tt
                        const dateObj = new Date(log.scanDate);
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const year = dateObj.getFullYear();
                        let hours = dateObj.getHours();
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        const formatted = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
                        return (
                          <tr key={idx}>
                            <td className="p-3 border-b">{formatted}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center">No scan records found for this customer in the selected date range.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Members Tab */}
      {selectedTab === 'active' && (
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
        </>
      )}

      {/* Expiring Members Tab */}
      {selectedTab === 'expiring' && (
        <>
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
      )}
    </>
  );
}
