import { gql } from '@apollo/client';

export const UPDATE_CUSTOMER_PHOTO = gql`
  mutation UpdateCustomerPhoto($customerId: Float!, $imagePath: String!) {
    UpdateCustomerPhoto(customer_id: $customerId, image_path: $imagePath) {
      code
      success
      message
    }
  }
`;
