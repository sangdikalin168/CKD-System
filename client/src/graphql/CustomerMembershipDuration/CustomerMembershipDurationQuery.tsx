import { gql } from '@apollo/client';

/**
 * GraphQL Query for getting customers grouped by membership duration
 * This query joins Customer and MemberPayment tables to get a comprehensive report
 * of customers with 1, 3, 6, and 12 month memberships
 */
export const GET_CUSTOMERS_BY_MEMBERSHIP_DURATION = gql`
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

/**
 * TypeScript interfaces for the query response
 */
export interface CustomerMembershipDetail {
  customer_id: number;
  customer_code: string;
  customer_name: string;
  phone: string;
  gender: string;
  end_membership_date: string;
  month_qty: number;
  promotion: string;
  price: number;
  payment_date: Date;
}

export interface MembershipDurationGroup {
  month_duration: number;
  total_customers: number;
  total_revenue: number;
  customers: CustomerMembershipDetail[];
}

export interface CustomersByMembershipDurationData {
  customersByMembershipDuration: {
    groups: MembershipDurationGroup[];
    total_all_customers: number;
    total_all_revenue: number;
  };
}

export interface CustomersByMembershipDurationVariables {
  fromDate: string;
  toDate: string;
}

/**
 * Example usage in a React component:
 * 
 * import { useQuery } from '@apollo/client';
 * import { 
 *   GET_CUSTOMERS_BY_MEMBERSHIP_DURATION,
 *   CustomersByMembershipDurationData,
 *   CustomersByMembershipDurationVariables
 * } from './CustomerMembershipDurationQuery';
 * 
 * function MembershipReport() {
 *   const { data, loading, error } = useQuery<
 *     CustomersByMembershipDurationData,
 *     CustomersByMembershipDurationVariables
 *   >(GET_CUSTOMERS_BY_MEMBERSHIP_DURATION, {
 *     variables: {
 *       fromDate: "2025-01-01",
 *       toDate: "2025-12-31"
 *     }
 *   });
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 * 
 *   return (
 *     <div>
 *       <h1>Membership Duration Report</h1>
 *       <p>Total Customers: {data?.customersByMembershipDuration.total_all_customers}</p>
 *       <p>Total Revenue: ${data?.customersByMembershipDuration.total_all_revenue.toFixed(2)}</p>
 *       
 *       {data?.customersByMembershipDuration.groups.map(group => (
 *         <div key={group.month_duration}>
 *           <h2>{group.month_duration} Month Membership</h2>
 *           <p>Customers: {group.total_customers}</p>
 *           <p>Revenue: ${group.total_revenue.toFixed(2)}</p>
 *           
 *           <table>
 *             <thead>
 *               <tr>
 *                 <th>Code</th>
 *                 <th>Name</th>
 *                 <th>Phone</th>
 *                 <th>Gender</th>
 *                 <th>Promotion</th>
 *                 <th>Price</th>
 *                 <th>Payment Date</th>
 *                 <th>End Date</th>
 *               </tr>
 *             </thead>
 *             <tbody>
 *               {group.customers.map(customer => (
 *                 <tr key={customer.customer_id}>
 *                   <td>{customer.customer_code}</td>
 *                   <td>{customer.customer_name}</td>
 *                   <td>{customer.phone}</td>
 *                   <td>{customer.gender}</td>
 *                   <td>{customer.promotion}</td>
 *                   <td>${customer.price.toFixed(2)}</td>
 *                   <td>{new Date(customer.payment_date).toLocaleDateString()}</td>
 *                   <td>{customer.end_membership_date}</td>
 *                 </tr>
 *               ))}
 *             </tbody>
 *           </table>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */
