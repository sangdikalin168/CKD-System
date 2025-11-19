# Quick Start Guide - Customer Membership Duration Report

## 🎯 What This Does
Gets a report of customers grouped by membership duration (1, 3, 6, or 12 months), joining Customer and MemberPayment tables.

## 🚀 How to Use

### GraphQL Query
```graphql
query {
  customersByMembershipDuration(
    fromDate: "2025-01-01"
    toDate: "2025-12-31"
  ) {
    total_all_customers
    total_all_revenue
    groups {
      month_duration          # 1, 3, 6, or 12
      total_customers         # Count for this duration
      total_revenue          # Sum for this duration
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
  }
}
```

### React/TypeScript Usage
```typescript
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS_BY_MEMBERSHIP_DURATION } from 
  './graphql/CustomerMembershipDuration/CustomerMembershipDurationQuery';

function MyComponent() {
  const { data, loading, error } = useQuery(
    GET_CUSTOMERS_BY_MEMBERSHIP_DURATION,
    {
      variables: {
        fromDate: "2025-01-01",
        toDate: "2025-12-31"
      }
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <h1>Total: {data.customersByMembershipDuration.total_all_customers} customers</h1>
      <h2>Revenue: ${data.customersByMembershipDuration.total_all_revenue}</h2>
      
      {data.customersByMembershipDuration.groups.map(group => (
        <div key={group.month_duration}>
          <h3>{group.month_duration} Month Plan</h3>
          <p>{group.total_customers} customers - ${group.total_revenue}</p>
          {/* Display customers table */}
        </div>
      ))}
    </div>
  );
}
```

## 📊 Response Structure
```
{
  groups: [
    { month_duration: 1, total_customers: 25, total_revenue: 5000, customers: [...] },
    { month_duration: 3, total_customers: 15, total_revenue: 8100, customers: [...] },
    { month_duration: 6, total_customers: 10, total_revenue: 9000, customers: [...] },
    { month_duration: 12, total_customers: 8, total_revenue: 16000, customers: [...] }
  ],
  total_all_customers: 58,
  total_all_revenue: 38100
}
```

## 🔑 Key Points
- **Joins**: Automatically joins Customer ↔ MemberPayment tables
- **Groups**: Returns 4 groups (1, 3, 6, 12 months)
- **Filters**: By payment date range
- **Includes**: Full customer details + payment info

## 📁 Files Created
1. `server/src/Resolvers/CustomerReport.ts` - Main resolver (modified)
2. `client/src/graphql/CustomerMembershipDuration/CustomerMembershipDurationQuery.tsx` - Client query
3. `server/src/Resolvers/CUSTOMER_MEMBERSHIP_DURATION_QUERY.md` - Full documentation
4. `IMPLEMENTATION_SUMMARY.md` - Complete implementation details

## 🧪 Test It
1. Start your GraphQL server
2. Go to GraphQL Playground (http://localhost:4000/graphql)
3. Copy the query above
4. Run it with your dates
5. Check the results!

## ⚙️ Customize
Want different durations? Edit line ~219 in `CustomerReport.ts`:
```typescript
const durations = [1, 3, 6, 12]; // Change to [1, 2, 3, 6, 12] or whatever you need
```
