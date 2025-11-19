# Customer Membership Duration Report - Implementation Summary

## Overview
This implementation provides a GraphQL query to generate reports of customers grouped by their membership duration (1 month, 3 months, 6 months, and 12 months). The report joins data from the `Customer` and `MemberPayment` tables.

## What Was Created

### 1. Server-Side Resolver (Backend)
**File**: `server/src/Resolvers/CustomerReport.ts`

#### New GraphQL Types Added:
- `CustomerMembershipDetail`: Contains detailed information about each customer and their payment
- `MembershipDurationGroup`: Groups customers by duration with totals
- `CustomersByMembershipDurationReport`: The main report response type

#### New Query Added:
```typescript
@Query(() => CustomersByMembershipDurationReport)
async customersByMembershipDuration(
    @Arg("fromDate") fromDate: string,
    @Arg("toDate") toDate: string
): Promise<CustomersByMembershipDurationReport>
```

### 2. Client-Side Query (Frontend)
**File**: `client/src/graphql/CustomerMembershipDuration/CustomerMembershipDurationQuery.tsx`

This file includes:
- GraphQL query definition
- TypeScript interfaces for type safety
- Complete React component example
- Usage documentation

### 3. Documentation
**File**: `server/src/Resolvers/CUSTOMER_MEMBERSHIP_DURATION_QUERY.md`

Contains:
- GraphQL query syntax
- Variables examples
- Response examples
- Usage instructions

## How It Works

### Backend Logic:
1. The query accepts two parameters: `fromDate` and `toDate`
2. It loops through the predefined durations: [1, 3, 6, 12] months
3. For each duration, it:
   - Joins `MemberPayment` and `Customer` tables on `customer_id`
   - Filters by `month_qty` (membership duration)
   - Filters by payment date range
   - Retrieves customer details and payment information
4. Calculates totals for each group and overall totals
5. Returns structured data grouped by membership duration

### Database Query:
The resolver uses TypeORM's QueryBuilder to perform:
```sql
SELECT 
  customer.customer_id,
  customer.customer_code,
  customer.customer_name,
  customer.phone,
  customer.gender,
  customer.end_membership_date,
  member_payment.month_qty,
  member_payment.promotion,
  member_payment.price,
  member_payment.payment_date
FROM member_payment
INNER JOIN customer ON customer.customer_id = member_payment.customer_id
WHERE member_payment.month_qty = ?
  AND member_payment.payment_date >= ?
  AND member_payment.payment_date <= ?
```

## Response Structure

```json
{
  "groups": [
    {
      "month_duration": 1,
      "total_customers": 25,
      "total_revenue": 5000.00,
      "customers": [
        {
          "customer_id": 1,
          "customer_code": "C001",
          "customer_name": "John Doe",
          "phone": "0123456789",
          "gender": "Male",
          "end_membership_date": "2025-02-01",
          "month_qty": 1,
          "promotion": "1 Month Full",
          "price": 200.00,
          "payment_date": "2025-01-01T10:00:00.000Z"
        }
      ]
    },
    // ... groups for 3, 6, 12 months
  ],
  "total_all_customers": 58,
  "total_all_revenue": 38100.00
}
```

## Features

✅ **Grouped Data**: Automatically groups customers by 1, 3, 6, and 12-month memberships
✅ **Date Filtering**: Filter by payment date range
✅ **Customer Details**: Full customer information including name, phone, gender, etc.
✅ **Payment Information**: Includes promotion type, price, and payment date
✅ **Summary Statistics**: 
   - Total customers per group
   - Total revenue per group
   - Overall totals across all groups
✅ **Type-Safe**: Full TypeScript support with interfaces

## Usage Examples

### Using in GraphQL Playground:
```graphql
query {
  customersByMembershipDuration(
    fromDate: "2025-01-01", 
    toDate: "2025-12-31"
  ) {
    groups {
      month_duration
      total_customers
      total_revenue
      customers {
        customer_name
        phone
        price
        promotion
      }
    }
    total_all_customers
    total_all_revenue
  }
}
```

### Using in React Component:
```typescript
import { useQuery } from '@apollo/client';
import { GET_CUSTOMERS_BY_MEMBERSHIP_DURATION } from './graphql/CustomerMembershipDuration/CustomerMembershipDurationQuery';

const { data, loading, error } = useQuery(
  GET_CUSTOMERS_BY_MEMBERSHIP_DURATION,
  {
    variables: {
      fromDate: "2025-01-01",
      toDate: "2025-12-31"
    }
  }
);
```

## Testing

To test the implementation:

1. **Start the server** (if not already running)
2. **Open GraphQL Playground** (usually at `http://localhost:4000/graphql`)
3. **Run the example query** from the documentation
4. **Verify the response** contains grouped data for each duration

## Next Steps

If you need to extend this functionality:

1. **Add more durations**: Modify the `durations` array in the resolver
2. **Add filters**: Add more arguments like `shift`, `gender`, etc.
3. **Export to Excel**: Create an endpoint to export the report
4. **Add charts**: Use the data to create visual charts on the frontend
5. **Add pagination**: For large datasets, implement pagination

## Files Modified/Created

1. ✅ `server/src/Resolvers/CustomerReport.ts` - Modified (added new query)
2. ✅ `client/src/graphql/CustomerMembershipDuration/CustomerMembershipDurationQuery.tsx` - Created
3. ✅ `server/src/Resolvers/CUSTOMER_MEMBERSHIP_DURATION_QUERY.md` - Created
4. ✅ `IMPLEMENTATION_SUMMARY.md` - Created (this file)

## Dependencies Required

The implementation uses existing dependencies:
- `typeorm` - For database queries
- `type-graphql` - For GraphQL schema
- `@apollo/client` - For client-side queries (frontend)

No new dependencies need to be installed.
