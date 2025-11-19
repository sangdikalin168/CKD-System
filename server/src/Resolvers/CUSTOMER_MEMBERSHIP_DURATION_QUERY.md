# Customer Membership Duration Report Query

## Overview
This query retrieves a report of customers grouped by their membership duration (1 month, 3 months, 6 months, and 12 months). It joins the `Customer` and `MemberPayment` tables to provide detailed information about each customer's membership.

## GraphQL Query

```graphql
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
```

## Variables Example

```json
{
  "fromDate": "2025-01-01",
  "toDate": "2025-12-31"
}
```

## Response Example

```json
{
  "data": {
    "customersByMembershipDuration": {
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
        {
          "month_duration": 3,
          "total_customers": 15,
          "total_revenue": 8100.00,
          "customers": [...]
        },
        {
          "month_duration": 6,
          "total_customers": 10,
          "total_revenue": 9000.00,
          "customers": [...]
        },
        {
          "month_duration": 12,
          "total_customers": 8,
          "total_revenue": 16000.00,
          "customers": [...]
        }
      ],
      "total_all_customers": 58,
      "total_all_revenue": 38100.00
    }
  }
}
```

## Features

- **Grouped by Duration**: Customers are automatically grouped by their membership duration (1, 3, 6, 12 months)
- **Date Range Filter**: Filter results by payment date range
- **Detailed Customer Info**: Includes customer details, payment info, and membership dates
- **Summary Statistics**: Provides total customers and revenue per duration group and overall totals

## Usage in Client

If you're using Apollo Client or similar GraphQL client, you can use this query like:

```typescript
import { gql } from '@apollo/client';

const GET_CUSTOMERS_BY_MEMBERSHIP_DURATION = gql`
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

// Usage
const { data, loading, error } = useQuery(GET_CUSTOMERS_BY_MEMBERSHIP_DURATION, {
  variables: {
    fromDate: "2025-01-01",
    toDate: "2025-12-31"
  }
});
```

## Notes

- The query joins `MemberPayment` and `Customer` tables based on `customer_id`
- Only includes customers who made payments within the specified date range
- Groups are predefined as [1, 3, 6, 12] months
- All prices are returned as float/double values
- Dates should be in 'YYYY-MM-DD' format
