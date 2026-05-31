import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// TypeScript interfaces
interface CustomerMembershipDetail {
  customer_id: number;
  customer_code: string;
  customer_name: string;
  phone: string;
  gender: string;
  end_membership_date: string;
  month_qty: number;
  promotion: string;
  price: number;
  payment_date: string;
}

interface MembershipDurationGroup {
  month_duration: number;
  total_customers: number;
  total_revenue: number;
  customers: CustomerMembershipDetail[];
}

interface CustomersByMembershipDurationData {
  customersByMembershipDuration: {
    groups: MembershipDurationGroup[];
    total_all_customers: number;
    total_all_revenue: number;
  };
}

const CUSTOMERS_BY_MEMBERSHIP_DURATION = gql`
  query CustomersByMembershipDuration($fromDate: String!, $toDate: String!) {
    customersByMembershipDuration(fromDate: $fromDate, toDate: $toDate) {
      groups {
        month_duration
        total_customers
        total_revenue
        customers {
          customer_id
          customer_code
          customer_name
          phone
          gender
          end_membership_date
          month_qty
          promotion
          price
          payment_date
        }
      }
      total_all_customers
      total_all_revenue
    }
  }
`;

export const CustomerTypeReport = () => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Helper function to format date
  const formatDate = (date: string | number): string => {
    if (!date) return '';
    
    // If it's a timestamp (number or numeric string)
    const timestamp = typeof date === 'string' ? parseInt(date) : date;
    if (!isNaN(timestamp) && timestamp > 10000000000) {
      return new Date(timestamp).toLocaleDateString('fr-CA');
    }
    
    // If it's already a date string
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('fr-CA');
      }
    }
    
    return String(date);
  };

  // Query for customers by membership duration
  const { loading, error, data, refetch } = useQuery<CustomersByMembershipDurationData>(CUSTOMERS_BY_MEMBERSHIP_DURATION, {
    variables: { fromDate: "2000-01-01", toDate: "2099-12-31" },
    skip: !hasSearched,
    fetchPolicy: "network-only"
  });

  const handleSearch = () => {
    setHasSearched(true);
    refetch();
  };

  const exportToExcel = () => {
    if (!data?.customersByMembershipDuration?.groups) return;

    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = data.customersByMembershipDuration.groups.map((group: MembershipDurationGroup) => ({
      'រយៈពេល (ខែ)': group.month_duration,
      'ចំនួនអតិថិជន': group.total_customers,
      'ចំណូលសរុប ($)': group.total_revenue.toFixed(2)
    }));

    summaryData.push({
      'រយៈពេល (ខែ)': 'សរុបរួម' as unknown as number,
      'ចំនួនអតិថិជន': data.customersByMembershipDuration.total_all_customers,
      'ចំណូលសរុប ($)': data.customersByMembershipDuration.total_all_revenue.toFixed(2)
    });

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "សង្ខេប");

    // Detail sheets for each duration
    data.customersByMembershipDuration.groups.forEach((group: MembershipDurationGroup) => {
      if (group.customers.length > 0) {
        const detailData = group.customers.map((customer: CustomerMembershipDetail) => ({
          'លេខកូដ': customer.customer_code,
          'ឈ្មោះ': customer.customer_name,
          'លេខទូរស័ព្ទ': customer.phone,
          'ភេទ': customer.gender,
          'ប្រភេទ': customer.promotion,
          'តម្លៃចុងក្រោយ ($)': customer.price.toFixed(2),
          'កាលបរិច្ឆេទទូទាត់ចុងក្រោយ': new Date(customer.payment_date).toLocaleDateString('fr-CA'),
          'ផុតកំណត់': formatDate(customer.end_membership_date)
        }));

        const ws = XLSX.utils.json_to_sheet(detailData);
        XLSX.utils.book_append_sheet(wb, ws, `${group.month_duration} ខែ`);
      }
    });

    const today = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `របាយការណ៍ប្រភេទសមាជិកបច្ចុប្បន្ន_${today}.xlsx`);
  };

  if (loading) return <p className="text-center mt-10">កំពុងផ្ទុក...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">កំហុស: {error.message}</p>;

  const reportData = data?.customersByMembershipDuration;
  const selectedGroup = selectedDuration !== null 
    ? reportData?.groups.find((g: MembershipDurationGroup) => g.month_duration === selectedDuration)
    : null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          របាយការណ៍ប្រភេទសមាជិកបច្ចុប្បន្ន
        </h1>

        {/* Search Button Section */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="w-full md:w-auto">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                  មើលប្រភេទសមាជិកបច្ចុប្បន្ន
                </h2>
                <p className="text-gray-600 text-xs md:text-sm">
                  បង្ហាញប្រភេទសមាជិកដែលអតិថិជនកំពុងប្រើប្រាស់បច្ចុប្បន្ន (ផ្អែកលើការទិញចុងក្រោយ)
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  onClick={handleSearch}
                  className="flex-1 md:flex-none"
                >
                  ស្វែងរក
                </Button>
                {reportData && (
                  <Button
                    onClick={exportToExcel}
                    variant="secondary"
                    className="flex-1 md:flex-none"
                  >
                    នាំចេញ Excel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        {reportData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 md:p-6 text-white">
                <h3 className="text-base md:text-lg font-semibold mb-2">ចំនួនអតិថិជនសរុប</h3>
                <p className="text-3xl md:text-4xl font-bold">{reportData.total_all_customers}</p>
                <p className="text-xs md:text-sm mt-2 opacity-90">អតិថិជនសកម្មបច្ចុប្បន្ន</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-4 md:p-6 text-white">
                <h3 className="text-base md:text-lg font-semibold mb-2">តម្លៃសរុបពីការទិញចុងក្រោយ</h3>
                <p className="text-3xl md:text-4xl font-bold">${reportData.total_all_revenue.toFixed(2)}</p>
                <p className="text-xs md:text-sm mt-2 opacity-90">ពីការទិញចុងក្រោយរបស់អតិថិជនសកម្ម</p>
              </div>
            </div>

            {/* Duration Groups */}
            <Card className="mb-6">
              <CardContent className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">សង្ខេបតាមប្រភេទ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {reportData.groups.map((group: MembershipDurationGroup) => (
                  <div
                    key={group.month_duration}
                    onClick={() => {
                      setSelectedDuration(group.month_duration);
                      setShowDetails(true);
                    }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 md:p-6 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-purple-700">
                        {group.month_duration} ខែ
                      </h3>
                      <div className="bg-purple-600 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-sm md:text-base">
                        {group.total_customers}
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-gray-600">អតិថិជន:</span>
                        <span className="font-semibold text-gray-800 text-sm md:text-base">{group.total_customers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-gray-600">ចំណូល:</span>
                        <span className="font-semibold text-green-600 text-sm md:text-base">${group.total_revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-gray-600">មធ្យម:</span>
                        <span className="font-semibold text-blue-600 text-sm md:text-base">
                          ${group.total_customers > 0 ? (group.total_revenue / group.total_customers).toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Customer List */}
            {showDetails && selectedGroup && (
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                      លម្អិតអតិថិជន {selectedDuration} ខែ
                    </h2>
                    <Button
                      onClick={() => setShowDetails(false)}
                      variant="destructive"
                      className="w-full sm:w-auto"
                    >
                      បិទ
                    </Button>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block md:hidden space-y-4">
                  {selectedGroup.customers.map((customer: CustomerMembershipDetail) => (
                    <div key={customer.customer_id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start pb-2 border-b border-gray-300">
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{customer.customer_name}</p>
                            <p className="text-sm text-gray-600">{customer.customer_code}</p>
                          </div>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-semibold">
                            ${customer.price.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">លេខទូរស័ព្ទ:</span>
                            <p className="font-medium text-gray-900">{customer.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">ភេទ:</span>
                            <p className="font-medium text-gray-900">{customer.gender}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">ប្រភេទ:</span>
                            <p className="font-medium text-gray-900">{customer.promotion}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">ផុតកំណត់:</span>
                            <p className="font-medium text-gray-900">{formatDate(customer.end_membership_date)}</p>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-300">
                          <span className="text-xs text-gray-500">កាលបរិច្ឆេទទូទាត់ចុងក្រោយ: </span>
                          <span className="text-xs text-gray-700 font-medium">
                            {new Date(customer.payment_date).toLocaleDateString('fr-CA')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Mobile Summary */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">សរុប:</span>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">${selectedGroup.total_revenue.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{selectedGroup.total_customers} អតិថិជន</p>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>លេខកូដ</TableHead>
                        <TableHead>ឈ្មោះ</TableHead>
                        <TableHead>លេខទូរស័ព្ទ</TableHead>
                        <TableHead>ភេទ</TableHead>
                        <TableHead>ប្រភេទ</TableHead>
                        <TableHead>តម្លៃចុងក្រោយ</TableHead>
                        <TableHead>កាលបរិច្ឆេទទូទាត់ចុងក្រោយ</TableHead>
                        <TableHead>ផុតកំណត់</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedGroup.customers.map((customer: CustomerMembershipDetail) => (
                        <TableRow key={customer.customer_id}>
                          <TableCell className="whitespace-nowrap text-sm text-gray-900">
                            {customer.customer_code}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm font-medium text-gray-900">
                            {customer.customer_name}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-gray-900">
                            {customer.phone}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-gray-900">
                            {customer.gender}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-gray-900">
                            {customer.promotion}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm font-semibold text-green-600">
                            ${customer.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-gray-900">
                            {new Date(customer.payment_date).toLocaleDateString('fr-CA')}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-gray-900">
                            {formatDate(customer.end_membership_date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={5} className="text-sm font-bold text-gray-900 text-right">
                          សរុប:
                        </TableCell>
                        <TableCell className="text-sm font-bold text-green-600">
                          ${selectedGroup.total_revenue.toFixed(2)}
                        </TableCell>
                        <TableCell colSpan={2} className="text-sm font-bold text-gray-900">
                          {selectedGroup.total_customers} អតិថិជន
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* No Data Message */}
        {!reportData && hasSearched && !loading && (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <p className="text-gray-500 text-base md:text-lg">
                មិនមានទិន្នន័យ
              </p>
            </CardContent>
          </Card>
        )}

        {!hasSearched && (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <p className="text-gray-500 text-base md:text-lg">
                សូមចុចប៊ូតុង "ស្វែងរក" ដើម្បីមើលរបាយការណ៍
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerTypeReport;
