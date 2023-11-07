import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CouponCard = {
  __typename?: 'CouponCard';
  card_name: Scalars['String'];
  coupon_code: Scalars['String'];
  created_date: Scalars['String'];
  id: Scalars['Float'];
  price: Scalars['Float'];
  quantity: Scalars['Float'];
  status: Scalars['String'];
};

export type CouponCardMutationResponse = CouponCardResponse & {
  __typename?: 'CouponCardMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CouponCardResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CouponPayment = {
  __typename?: 'CouponPayment';
  card_name: Scalars['String'];
  coupon_code: Scalars['String'];
  customer_id: Scalars['Float'];
  payment_date: Scalars['String'];
  payment_id: Scalars['Float'];
  price: Scalars['Float'];
  quantity: Scalars['Float'];
  user_id: Scalars['Float'];
};

export type CouponPaymentMutationResponse = CouponPaymentResponse & {
  __typename?: 'CouponPaymentMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type CouponPaymentResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type Customer = {
  __typename?: 'Customer';
  created_by: Scalars['Float'];
  created_date: Scalars['String'];
  customer_code: Scalars['String'];
  customer_id: Scalars['Float'];
  customer_name: Scalars['String'];
  end_fruit_date: Scalars['String'];
  end_membership_date: Scalars['String'];
  fingerprint: Scalars['String'];
  gender: Scalars['String'];
  image_path: Scalars['String'];
  key_status: Scalars['String'];
  phone: Scalars['String'];
  shift: Scalars['String'];
  towel_status: Scalars['String'];
};

export type CustomerMutationResponse = ICustomerResponse & {
  __typename?: 'CustomerMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type FruitPayment = {
  __typename?: 'FruitPayment';
  customer_id: Scalars['Float'];
  month_qty: Scalars['Float'];
  new_end: Scalars['String'];
  old_end: Scalars['String'];
  payment_date: Scalars['DateTime'];
  payment_id: Scalars['Float'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  user_id: Scalars['Float'];
};

export type FruitPaymentMutationResponse = FruitPaymentResponse & {
  __typename?: 'FruitPaymentMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type FruitPaymentResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type FruitPrice = {
  __typename?: 'FruitPrice';
  age: Scalars['String'];
  id: Scalars['Float'];
  month_qty: Scalars['Float'];
  name: Scalars['String'];
  price: Scalars['Float'];
};

export type FruitPriceTableMutationResponse = FruitPriceTableResponse & {
  __typename?: 'FruitPriceTableMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type FruitPriceTableResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type GetUser = {
  __typename?: 'GetUser';
  branch: Scalars['String'];
  display_name: Scalars['String'];
  role: Scalars['String'];
  user_id: Scalars['ID'];
};

export type ICustomerResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type IMemberPriceTableResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type IMutationResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type LoginInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type MemberPayment = {
  __typename?: 'MemberPayment';
  customer_id: Scalars['Float'];
  month_qty: Scalars['Float'];
  new_end: Scalars['String'];
  old_end: Scalars['String'];
  payment_date: Scalars['DateTime'];
  payment_id: Scalars['Float'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  shift: Scalars['String'];
  user_id: Scalars['Float'];
};

export type MemberPaymentDetail = {
  __typename?: 'MemberPaymentDetail';
  customer_name: Scalars['String'];
  display_name: Scalars['String'];
  new_end: Scalars['DateTime'];
  old_end: Scalars['DateTime'];
  payment_date: Scalars['DateTime'];
  payment_id: Scalars['Float'];
  phone: Scalars['String'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
};

export type MemberPaymentMutationResponse = MemberPaymentResponse & {
  __typename?: 'MemberPaymentMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type MemberPaymentResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type MemberPriceTable = {
  __typename?: 'MemberPriceTable';
  age: Scalars['String'];
  id: Scalars['Float'];
  member_type: Scalars['String'];
  month_qty: Scalars['Float'];
  name: Scalars['String'];
  price: Scalars['Float'];
  shift: Scalars['String'];
};

export type MemberPriceTableMutationResponse = IMemberPriceTableResponse & {
  __typename?: 'MemberPriceTableMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  CreateCouponPayment: CouponPaymentMutationResponse;
  CreateCustomer: CustomerMutationResponse;
  CreateCustomerPayment: MemberPaymentMutationResponse;
  CreateFruitPayment: FruitPaymentMutationResponse;
  CreateTicketPayment: TicketPaymentMutationResponse;
  CreateTrainningPayment: TrainningPaymentMutationResponse;
  UpdateCustomer: CustomerMutationResponse;
  create_user: UserMutationResponse;
  login: UserMutationResponse;
  logout: UserMutationResponse;
};


export type MutationCreateCouponPaymentArgs = {
  card_name: Scalars['String'];
  coupon_code: Scalars['String'];
  customer_id: Scalars['Float'];
  price: Scalars['Float'];
  quantity: Scalars['Float'];
  user_id: Scalars['Float'];
};


export type MutationCreateCustomerArgs = {
  created_by: Scalars['Float'];
  customer_name: Scalars['String'];
  gender: Scalars['String'];
  phone: Scalars['String'];
};


export type MutationCreateCustomerPaymentArgs = {
  customer_id: Scalars['Float'];
  month_qty: Scalars['Float'];
  new_end: Scalars['String'];
  old_end: Scalars['String'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  shift: Scalars['String'];
  user_id: Scalars['Float'];
};


export type MutationCreateFruitPaymentArgs = {
  customer_id: Scalars['Float'];
  month_qty: Scalars['Float'];
  new_end: Scalars['String'];
  old_end: Scalars['String'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  user_id: Scalars['Float'];
};


export type MutationCreateTicketPaymentArgs = {
  price: Scalars['Float'];
  ticket_code: Scalars['String'];
  user_id: Scalars['Float'];
};


export type MutationCreateTrainningPaymentArgs = {
  customer_id: Scalars['Float'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  type: Scalars['String'];
  user_id: Scalars['Float'];
};


export type MutationUpdateCustomerArgs = {
  customer_id: Scalars['Float'];
  phone: Scalars['String'];
};


export type MutationCreate_UserArgs = {
  userInput: RegisterInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationLogoutArgs = {
  user_id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  GetCouponCard: Array<CouponCard>;
  GetCouponPayment: Array<CouponPayment>;
  GetCustomerDetail: Array<Customer>;
  GetCustomers: Array<Customer>;
  GetFruitPayment: Array<FruitPayment>;
  GetFruitPriceTable: Array<FruitPrice>;
  GetMemberPayment: Array<MemberPayment>;
  GetMemberPriceTable: Array<MemberPriceTable>;
  GetTrainningPayment: Array<TrainningPayment>;
  GetTranningPrice: Array<TrainningPrice>;
  MemberPaymentDetail: MemberPaymentDetail;
  get_user: GetUser;
  users: Array<Users>;
};


export type QueryGetCouponCardArgs = {
  coupon_code: Scalars['String'];
};


export type QueryGetCouponPaymentArgs = {
  customer_id: Scalars['Float'];
};


export type QueryGetCustomerDetailArgs = {
  customer_id: Scalars['Float'];
};


export type QueryGetFruitPaymentArgs = {
  customer_id: Scalars['Float'];
};


export type QueryGetMemberPaymentArgs = {
  customer_id: Scalars['Float'];
};


export type QueryGetTrainningPaymentArgs = {
  customer_id: Scalars['Float'];
};


export type QueryMemberPaymentDetailArgs = {
  payment_id: Scalars['Float'];
};


export type QueryGet_UserArgs = {
  user_id: Scalars['ID'];
};

export type RegisterInput = {
  display_name: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  role: Scalars['String'];
  username: Scalars['String'];
};

export type TicketPayment = {
  __typename?: 'TicketPayment';
  is_check: Scalars['Float'];
  payment_date: Scalars['String'];
  payment_id: Scalars['Float'];
  price: Scalars['Float'];
  ticket_code: Scalars['String'];
  user_id: Scalars['Float'];
};

export type TicketPaymentMutationResponse = TicketPaymentResponse & {
  __typename?: 'TicketPaymentMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type TicketPaymentResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type TrainningPayment = {
  __typename?: 'TrainningPayment';
  customer_id: Scalars['Float'];
  payment_date: Scalars['String'];
  payment_id: Scalars['Float'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  type: Scalars['String'];
  user_id: Scalars['Float'];
};

export type TrainningPaymentMutationResponse = TrainningPaymentResponse & {
  __typename?: 'TrainningPaymentMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type TrainningPaymentResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  payment_id: Scalars['Float'];
  success: Scalars['Boolean'];
};

export type TrainningPrice = {
  __typename?: 'TrainningPrice';
  id: Scalars['Float'];
  month_qty: Scalars['Float'];
  name: Scalars['String'];
  price: Scalars['Float'];
  type: Scalars['String'];
};

export type TranningPriceMutationResponse = TranningPriceResponse & {
  __typename?: 'TranningPriceMutationResponse';
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type TranningPriceResponse = {
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type UserMutationResponse = IMutationResponse & {
  __typename?: 'UserMutationResponse';
  accessToken?: Maybe<Scalars['String']>;
  code: Scalars['Float'];
  message?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  user?: Maybe<Users>;
};

export type Users = {
  __typename?: 'Users';
  created_at: Scalars['String'];
  display_name: Scalars['String'];
  image: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  role: Scalars['String'];
  user_id: Scalars['ID'];
  username: Scalars['String'];
};

export type CreateCouponPaymentMutationVariables = Exact<{
  couponCode: Scalars['String'];
  quantity: Scalars['Float'];
  price: Scalars['Float'];
  cardName: Scalars['String'];
  customerId: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type CreateCouponPaymentMutation = { __typename?: 'Mutation', CreateCouponPayment: { __typename?: 'CouponPaymentMutationResponse', payment_id: number, code: number, success: boolean, message?: string | null } };

export type GetCouponCardQueryVariables = Exact<{
  couponCode: Scalars['String'];
}>;


export type GetCouponCardQuery = { __typename?: 'Query', GetCouponCard: Array<{ __typename?: 'CouponCard', id: number, created_date: string, coupon_code: string, status: string, quantity: number, price: number, card_name: string }> };

export type CreateCustomerMutationVariables = Exact<{
  createdBy: Scalars['Float'];
  gender: Scalars['String'];
  phone: Scalars['String'];
  customerName: Scalars['String'];
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', CreateCustomer: { __typename?: 'CustomerMutationResponse', code: number, success: boolean, message?: string | null } };

export type GetCustomerDetailQueryVariables = Exact<{
  customerId: Scalars['Float'];
}>;


export type GetCustomerDetailQuery = { __typename?: 'Query', GetCustomerDetail: Array<{ __typename?: 'Customer', customer_id: number, created_date: string, created_by: number, customer_code: string, customer_name: string, phone: string, gender: string, image_path: string, fingerprint: string, end_membership_date: string, end_fruit_date: string, key_status: string, towel_status: string, shift: string }> };

export type GetCustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomersQuery = { __typename?: 'Query', GetCustomers: Array<{ __typename?: 'Customer', customer_id: number, created_date: string, created_by: number, customer_code: string, customer_name: string, phone: string, gender: string, image_path: string, fingerprint: string, end_membership_date: string, key_status: string, towel_status: string }> };

export type UpdateCustomerMutationVariables = Exact<{
  phone: Scalars['String'];
  customerId: Scalars['Float'];
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', UpdateCustomer: { __typename?: 'CustomerMutationResponse', code: number, success: boolean, message?: string | null } };

export type GetMemberPriceTableQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMemberPriceTableQuery = { __typename?: 'Query', GetMemberPriceTable: Array<{ __typename?: 'MemberPriceTable', id: number, name: string, age: string, member_type: string, month_qty: number, price: number, shift: string }> };

export type CreateFruitPaymentMutationVariables = Exact<{
  monthQty: Scalars['Float'];
  newEnd: Scalars['String'];
  oldEnd: Scalars['String'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  customerId: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type CreateFruitPaymentMutation = { __typename?: 'Mutation', CreateFruitPayment: { __typename?: 'FruitPaymentMutationResponse', payment_id: number, code: number, success: boolean, message?: string | null } };

export type GetFruitPaymentQueryVariables = Exact<{
  customerId: Scalars['Float'];
}>;


export type GetFruitPaymentQuery = { __typename?: 'Query', GetFruitPayment: Array<{ __typename?: 'FruitPayment', payment_id: number, payment_date: any, user_id: number, customer_id: number, promotion: string, price: number, old_end: string, new_end: string, month_qty: number }> };

export type GetFruitPriceTableQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFruitPriceTableQuery = { __typename?: 'Query', GetFruitPriceTable: Array<{ __typename?: 'FruitPrice', id: number, name: string, age: string, month_qty: number, price: number }> };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserMutationResponse', code: number, success: boolean, message?: string | null, accessToken?: string | null, user?: { __typename?: 'Users', display_name: string, role: string, user_id: string } | null } };

export type CreateCustomerPaymentMutationVariables = Exact<{
  monthQty: Scalars['Float'];
  shift: Scalars['String'];
  newEnd: Scalars['String'];
  oldEnd: Scalars['String'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  customerId: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type CreateCustomerPaymentMutation = { __typename?: 'Mutation', CreateCustomerPayment: { __typename?: 'MemberPaymentMutationResponse', payment_id: number, code: number, success: boolean, message?: string | null } };

export type GetMemberPaymentQueryVariables = Exact<{
  customerId: Scalars['Float'];
}>;


export type GetMemberPaymentQuery = { __typename?: 'Query', GetMemberPayment: Array<{ __typename?: 'MemberPayment', payment_id: number, payment_date: any, user_id: number, customer_id: number, promotion: string, price: number, old_end: string, new_end: string, shift: string, month_qty: number }> };

export type MemberPaymentDetailQueryVariables = Exact<{
  paymentId: Scalars['Float'];
}>;


export type MemberPaymentDetailQuery = { __typename?: 'Query', MemberPaymentDetail: { __typename?: 'MemberPaymentDetail', payment_id: number, payment_date: any, display_name: string, customer_name: string, phone: string, promotion: string, price: number, old_end: any, new_end: any } };

export type CreateTicketPaymentMutationVariables = Exact<{
  ticketCode: Scalars['String'];
  price: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type CreateTicketPaymentMutation = { __typename?: 'Mutation', CreateTicketPayment: { __typename?: 'TicketPaymentMutationResponse', payment_id: number, code: number, success: boolean, message?: string | null } };

export type CreateTrainningPaymentMutationVariables = Exact<{
  type: Scalars['String'];
  price: Scalars['Float'];
  promotion: Scalars['String'];
  customerId: Scalars['Float'];
  userId: Scalars['Float'];
}>;


export type CreateTrainningPaymentMutation = { __typename?: 'Mutation', CreateTrainningPayment: { __typename?: 'TrainningPaymentMutationResponse', payment_id: number, code: number, success: boolean, message?: string | null } };

export type GetTrainningPaymentQueryVariables = Exact<{
  customerId: Scalars['Float'];
}>;


export type GetTrainningPaymentQuery = { __typename?: 'Query', GetTrainningPayment: Array<{ __typename?: 'TrainningPayment', payment_id: number, payment_date: string, user_id: number, customer_id: number, type: string, promotion: string, price: number }> };

export type GetTranningPriceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTranningPriceQuery = { __typename?: 'Query', GetTranningPrice: Array<{ __typename?: 'TrainningPrice', id: number, name: string, type: string, month_qty: number, price: number }> };


export const CreateCouponPaymentDocument = gql`
    mutation CreateCouponPayment($couponCode: String!, $quantity: Float!, $price: Float!, $cardName: String!, $customerId: Float!, $userId: Float!) {
  CreateCouponPayment(
    coupon_code: $couponCode
    quantity: $quantity
    price: $price
    card_name: $cardName
    customer_id: $customerId
    user_id: $userId
  ) {
    payment_id
    code
    success
    message
  }
}
    `;
export type CreateCouponPaymentMutationFn = Apollo.MutationFunction<CreateCouponPaymentMutation, CreateCouponPaymentMutationVariables>;

/**
 * __useCreateCouponPaymentMutation__
 *
 * To run a mutation, you first call `useCreateCouponPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCouponPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCouponPaymentMutation, { data, loading, error }] = useCreateCouponPaymentMutation({
 *   variables: {
 *      couponCode: // value for 'couponCode'
 *      quantity: // value for 'quantity'
 *      price: // value for 'price'
 *      cardName: // value for 'cardName'
 *      customerId: // value for 'customerId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateCouponPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCouponPaymentMutation, CreateCouponPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCouponPaymentMutation, CreateCouponPaymentMutationVariables>(CreateCouponPaymentDocument, options);
      }
export type CreateCouponPaymentMutationHookResult = ReturnType<typeof useCreateCouponPaymentMutation>;
export type CreateCouponPaymentMutationResult = Apollo.MutationResult<CreateCouponPaymentMutation>;
export type CreateCouponPaymentMutationOptions = Apollo.BaseMutationOptions<CreateCouponPaymentMutation, CreateCouponPaymentMutationVariables>;
export const GetCouponCardDocument = gql`
    query GetCouponCard($couponCode: String!) {
  GetCouponCard(coupon_code: $couponCode) {
    id
    created_date
    coupon_code
    status
    quantity
    price
    card_name
  }
}
    `;

/**
 * __useGetCouponCardQuery__
 *
 * To run a query within a React component, call `useGetCouponCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCouponCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCouponCardQuery({
 *   variables: {
 *      couponCode: // value for 'couponCode'
 *   },
 * });
 */
export function useGetCouponCardQuery(baseOptions: Apollo.QueryHookOptions<GetCouponCardQuery, GetCouponCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCouponCardQuery, GetCouponCardQueryVariables>(GetCouponCardDocument, options);
      }
export function useGetCouponCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCouponCardQuery, GetCouponCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCouponCardQuery, GetCouponCardQueryVariables>(GetCouponCardDocument, options);
        }
export type GetCouponCardQueryHookResult = ReturnType<typeof useGetCouponCardQuery>;
export type GetCouponCardLazyQueryHookResult = ReturnType<typeof useGetCouponCardLazyQuery>;
export type GetCouponCardQueryResult = Apollo.QueryResult<GetCouponCardQuery, GetCouponCardQueryVariables>;
export const CreateCustomerDocument = gql`
    mutation CreateCustomer($createdBy: Float!, $gender: String!, $phone: String!, $customerName: String!) {
  CreateCustomer(
    created_by: $createdBy
    gender: $gender
    phone: $phone
    customer_name: $customerName
  ) {
    code
    success
    message
  }
}
    `;
export type CreateCustomerMutationFn = Apollo.MutationFunction<CreateCustomerMutation, CreateCustomerMutationVariables>;

/**
 * __useCreateCustomerMutation__
 *
 * To run a mutation, you first call `useCreateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerMutation, { data, loading, error }] = useCreateCustomerMutation({
 *   variables: {
 *      createdBy: // value for 'createdBy'
 *      gender: // value for 'gender'
 *      phone: // value for 'phone'
 *      customerName: // value for 'customerName'
 *   },
 * });
 */
export function useCreateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerMutation, CreateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(CreateCustomerDocument, options);
      }
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = Apollo.MutationResult<CreateCustomerMutation>;
export type CreateCustomerMutationOptions = Apollo.BaseMutationOptions<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const GetCustomerDetailDocument = gql`
    query GetCustomerDetail($customerId: Float!) {
  GetCustomerDetail(customer_id: $customerId) {
    customer_id
    created_date
    created_by
    customer_code
    customer_name
    phone
    gender
    image_path
    fingerprint
    end_membership_date
    end_fruit_date
    key_status
    towel_status
    shift
  }
}
    `;

/**
 * __useGetCustomerDetailQuery__
 *
 * To run a query within a React component, call `useGetCustomerDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomerDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomerDetailQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useGetCustomerDetailQuery(baseOptions: Apollo.QueryHookOptions<GetCustomerDetailQuery, GetCustomerDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomerDetailQuery, GetCustomerDetailQueryVariables>(GetCustomerDetailDocument, options);
      }
export function useGetCustomerDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomerDetailQuery, GetCustomerDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomerDetailQuery, GetCustomerDetailQueryVariables>(GetCustomerDetailDocument, options);
        }
export type GetCustomerDetailQueryHookResult = ReturnType<typeof useGetCustomerDetailQuery>;
export type GetCustomerDetailLazyQueryHookResult = ReturnType<typeof useGetCustomerDetailLazyQuery>;
export type GetCustomerDetailQueryResult = Apollo.QueryResult<GetCustomerDetailQuery, GetCustomerDetailQueryVariables>;
export const GetCustomersDocument = gql`
    query GetCustomers {
  GetCustomers {
    customer_id
    created_date
    created_by
    customer_code
    customer_name
    phone
    gender
    image_path
    fingerprint
    end_membership_date
    key_status
    towel_status
  }
}
    `;

/**
 * __useGetCustomersQuery__
 *
 * To run a query within a React component, call `useGetCustomersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCustomersQuery(baseOptions?: Apollo.QueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCustomersQuery, GetCustomersQueryVariables>(GetCustomersDocument, options);
      }
export function useGetCustomersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCustomersQuery, GetCustomersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCustomersQuery, GetCustomersQueryVariables>(GetCustomersDocument, options);
        }
export type GetCustomersQueryHookResult = ReturnType<typeof useGetCustomersQuery>;
export type GetCustomersLazyQueryHookResult = ReturnType<typeof useGetCustomersLazyQuery>;
export type GetCustomersQueryResult = Apollo.QueryResult<GetCustomersQuery, GetCustomersQueryVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($phone: String!, $customerId: Float!) {
  UpdateCustomer(phone: $phone, customer_id: $customerId) {
    code
    success
    message
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      phone: // value for 'phone'
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
      }
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const GetMemberPriceTableDocument = gql`
    query GetMemberPriceTable {
  GetMemberPriceTable {
    id
    name
    age
    member_type
    month_qty
    price
    shift
  }
}
    `;

/**
 * __useGetMemberPriceTableQuery__
 *
 * To run a query within a React component, call `useGetMemberPriceTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberPriceTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberPriceTableQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMemberPriceTableQuery(baseOptions?: Apollo.QueryHookOptions<GetMemberPriceTableQuery, GetMemberPriceTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberPriceTableQuery, GetMemberPriceTableQueryVariables>(GetMemberPriceTableDocument, options);
      }
export function useGetMemberPriceTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberPriceTableQuery, GetMemberPriceTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberPriceTableQuery, GetMemberPriceTableQueryVariables>(GetMemberPriceTableDocument, options);
        }
export type GetMemberPriceTableQueryHookResult = ReturnType<typeof useGetMemberPriceTableQuery>;
export type GetMemberPriceTableLazyQueryHookResult = ReturnType<typeof useGetMemberPriceTableLazyQuery>;
export type GetMemberPriceTableQueryResult = Apollo.QueryResult<GetMemberPriceTableQuery, GetMemberPriceTableQueryVariables>;
export const CreateFruitPaymentDocument = gql`
    mutation CreateFruitPayment($monthQty: Float!, $newEnd: String!, $oldEnd: String!, $price: Float!, $promotion: String!, $customerId: Float!, $userId: Float!) {
  CreateFruitPayment(
    month_qty: $monthQty
    new_end: $newEnd
    old_end: $oldEnd
    price: $price
    promotion: $promotion
    customer_id: $customerId
    user_id: $userId
  ) {
    payment_id
    code
    success
    message
  }
}
    `;
export type CreateFruitPaymentMutationFn = Apollo.MutationFunction<CreateFruitPaymentMutation, CreateFruitPaymentMutationVariables>;

/**
 * __useCreateFruitPaymentMutation__
 *
 * To run a mutation, you first call `useCreateFruitPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFruitPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFruitPaymentMutation, { data, loading, error }] = useCreateFruitPaymentMutation({
 *   variables: {
 *      monthQty: // value for 'monthQty'
 *      newEnd: // value for 'newEnd'
 *      oldEnd: // value for 'oldEnd'
 *      price: // value for 'price'
 *      promotion: // value for 'promotion'
 *      customerId: // value for 'customerId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateFruitPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateFruitPaymentMutation, CreateFruitPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFruitPaymentMutation, CreateFruitPaymentMutationVariables>(CreateFruitPaymentDocument, options);
      }
export type CreateFruitPaymentMutationHookResult = ReturnType<typeof useCreateFruitPaymentMutation>;
export type CreateFruitPaymentMutationResult = Apollo.MutationResult<CreateFruitPaymentMutation>;
export type CreateFruitPaymentMutationOptions = Apollo.BaseMutationOptions<CreateFruitPaymentMutation, CreateFruitPaymentMutationVariables>;
export const GetFruitPaymentDocument = gql`
    query GetFruitPayment($customerId: Float!) {
  GetFruitPayment(customer_id: $customerId) {
    payment_id
    payment_date
    user_id
    customer_id
    promotion
    price
    old_end
    new_end
    month_qty
  }
}
    `;

/**
 * __useGetFruitPaymentQuery__
 *
 * To run a query within a React component, call `useGetFruitPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFruitPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFruitPaymentQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useGetFruitPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetFruitPaymentQuery, GetFruitPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFruitPaymentQuery, GetFruitPaymentQueryVariables>(GetFruitPaymentDocument, options);
      }
export function useGetFruitPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFruitPaymentQuery, GetFruitPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFruitPaymentQuery, GetFruitPaymentQueryVariables>(GetFruitPaymentDocument, options);
        }
export type GetFruitPaymentQueryHookResult = ReturnType<typeof useGetFruitPaymentQuery>;
export type GetFruitPaymentLazyQueryHookResult = ReturnType<typeof useGetFruitPaymentLazyQuery>;
export type GetFruitPaymentQueryResult = Apollo.QueryResult<GetFruitPaymentQuery, GetFruitPaymentQueryVariables>;
export const GetFruitPriceTableDocument = gql`
    query GetFruitPriceTable {
  GetFruitPriceTable {
    id
    name
    age
    month_qty
    price
  }
}
    `;

/**
 * __useGetFruitPriceTableQuery__
 *
 * To run a query within a React component, call `useGetFruitPriceTableQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFruitPriceTableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFruitPriceTableQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFruitPriceTableQuery(baseOptions?: Apollo.QueryHookOptions<GetFruitPriceTableQuery, GetFruitPriceTableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFruitPriceTableQuery, GetFruitPriceTableQueryVariables>(GetFruitPriceTableDocument, options);
      }
export function useGetFruitPriceTableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFruitPriceTableQuery, GetFruitPriceTableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFruitPriceTableQuery, GetFruitPriceTableQueryVariables>(GetFruitPriceTableDocument, options);
        }
export type GetFruitPriceTableQueryHookResult = ReturnType<typeof useGetFruitPriceTableQuery>;
export type GetFruitPriceTableLazyQueryHookResult = ReturnType<typeof useGetFruitPriceTableLazyQuery>;
export type GetFruitPriceTableQueryResult = Apollo.QueryResult<GetFruitPriceTableQuery, GetFruitPriceTableQueryVariables>;
export const LoginDocument = gql`
    mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    code
    success
    message
    user {
      display_name
      role
      user_id
    }
    accessToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const CreateCustomerPaymentDocument = gql`
    mutation CreateCustomerPayment($monthQty: Float!, $shift: String!, $newEnd: String!, $oldEnd: String!, $price: Float!, $promotion: String!, $customerId: Float!, $userId: Float!) {
  CreateCustomerPayment(
    month_qty: $monthQty
    shift: $shift
    new_end: $newEnd
    old_end: $oldEnd
    price: $price
    promotion: $promotion
    customer_id: $customerId
    user_id: $userId
  ) {
    payment_id
    code
    success
    message
  }
}
    `;
export type CreateCustomerPaymentMutationFn = Apollo.MutationFunction<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>;

/**
 * __useCreateCustomerPaymentMutation__
 *
 * To run a mutation, you first call `useCreateCustomerPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerPaymentMutation, { data, loading, error }] = useCreateCustomerPaymentMutation({
 *   variables: {
 *      monthQty: // value for 'monthQty'
 *      shift: // value for 'shift'
 *      newEnd: // value for 'newEnd'
 *      oldEnd: // value for 'oldEnd'
 *      price: // value for 'price'
 *      promotion: // value for 'promotion'
 *      customerId: // value for 'customerId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateCustomerPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>(CreateCustomerPaymentDocument, options);
      }
export type CreateCustomerPaymentMutationHookResult = ReturnType<typeof useCreateCustomerPaymentMutation>;
export type CreateCustomerPaymentMutationResult = Apollo.MutationResult<CreateCustomerPaymentMutation>;
export type CreateCustomerPaymentMutationOptions = Apollo.BaseMutationOptions<CreateCustomerPaymentMutation, CreateCustomerPaymentMutationVariables>;
export const GetMemberPaymentDocument = gql`
    query GetMemberPayment($customerId: Float!) {
  GetMemberPayment(customer_id: $customerId) {
    payment_id
    payment_date
    user_id
    customer_id
    promotion
    price
    old_end
    new_end
    shift
    month_qty
  }
}
    `;

/**
 * __useGetMemberPaymentQuery__
 *
 * To run a query within a React component, call `useGetMemberPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberPaymentQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useGetMemberPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetMemberPaymentQuery, GetMemberPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMemberPaymentQuery, GetMemberPaymentQueryVariables>(GetMemberPaymentDocument, options);
      }
export function useGetMemberPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMemberPaymentQuery, GetMemberPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMemberPaymentQuery, GetMemberPaymentQueryVariables>(GetMemberPaymentDocument, options);
        }
export type GetMemberPaymentQueryHookResult = ReturnType<typeof useGetMemberPaymentQuery>;
export type GetMemberPaymentLazyQueryHookResult = ReturnType<typeof useGetMemberPaymentLazyQuery>;
export type GetMemberPaymentQueryResult = Apollo.QueryResult<GetMemberPaymentQuery, GetMemberPaymentQueryVariables>;
export const MemberPaymentDetailDocument = gql`
    query MemberPaymentDetail($paymentId: Float!) {
  MemberPaymentDetail(payment_id: $paymentId) {
    payment_id
    payment_date
    display_name
    customer_name
    phone
    promotion
    price
    old_end
    new_end
  }
}
    `;

/**
 * __useMemberPaymentDetailQuery__
 *
 * To run a query within a React component, call `useMemberPaymentDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberPaymentDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberPaymentDetailQuery({
 *   variables: {
 *      paymentId: // value for 'paymentId'
 *   },
 * });
 */
export function useMemberPaymentDetailQuery(baseOptions: Apollo.QueryHookOptions<MemberPaymentDetailQuery, MemberPaymentDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberPaymentDetailQuery, MemberPaymentDetailQueryVariables>(MemberPaymentDetailDocument, options);
      }
export function useMemberPaymentDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberPaymentDetailQuery, MemberPaymentDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberPaymentDetailQuery, MemberPaymentDetailQueryVariables>(MemberPaymentDetailDocument, options);
        }
export type MemberPaymentDetailQueryHookResult = ReturnType<typeof useMemberPaymentDetailQuery>;
export type MemberPaymentDetailLazyQueryHookResult = ReturnType<typeof useMemberPaymentDetailLazyQuery>;
export type MemberPaymentDetailQueryResult = Apollo.QueryResult<MemberPaymentDetailQuery, MemberPaymentDetailQueryVariables>;
export const CreateTicketPaymentDocument = gql`
    mutation CreateTicketPayment($ticketCode: String!, $price: Float!, $userId: Float!) {
  CreateTicketPayment(ticket_code: $ticketCode, price: $price, user_id: $userId) {
    payment_id
    code
    success
    message
  }
}
    `;
export type CreateTicketPaymentMutationFn = Apollo.MutationFunction<CreateTicketPaymentMutation, CreateTicketPaymentMutationVariables>;

/**
 * __useCreateTicketPaymentMutation__
 *
 * To run a mutation, you first call `useCreateTicketPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTicketPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTicketPaymentMutation, { data, loading, error }] = useCreateTicketPaymentMutation({
 *   variables: {
 *      ticketCode: // value for 'ticketCode'
 *      price: // value for 'price'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateTicketPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTicketPaymentMutation, CreateTicketPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTicketPaymentMutation, CreateTicketPaymentMutationVariables>(CreateTicketPaymentDocument, options);
      }
export type CreateTicketPaymentMutationHookResult = ReturnType<typeof useCreateTicketPaymentMutation>;
export type CreateTicketPaymentMutationResult = Apollo.MutationResult<CreateTicketPaymentMutation>;
export type CreateTicketPaymentMutationOptions = Apollo.BaseMutationOptions<CreateTicketPaymentMutation, CreateTicketPaymentMutationVariables>;
export const CreateTrainningPaymentDocument = gql`
    mutation CreateTrainningPayment($type: String!, $price: Float!, $promotion: String!, $customerId: Float!, $userId: Float!) {
  CreateTrainningPayment(
    type: $type
    price: $price
    promotion: $promotion
    customer_id: $customerId
    user_id: $userId
  ) {
    payment_id
    code
    success
    message
  }
}
    `;
export type CreateTrainningPaymentMutationFn = Apollo.MutationFunction<CreateTrainningPaymentMutation, CreateTrainningPaymentMutationVariables>;

/**
 * __useCreateTrainningPaymentMutation__
 *
 * To run a mutation, you first call `useCreateTrainningPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTrainningPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTrainningPaymentMutation, { data, loading, error }] = useCreateTrainningPaymentMutation({
 *   variables: {
 *      type: // value for 'type'
 *      price: // value for 'price'
 *      promotion: // value for 'promotion'
 *      customerId: // value for 'customerId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useCreateTrainningPaymentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTrainningPaymentMutation, CreateTrainningPaymentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTrainningPaymentMutation, CreateTrainningPaymentMutationVariables>(CreateTrainningPaymentDocument, options);
      }
export type CreateTrainningPaymentMutationHookResult = ReturnType<typeof useCreateTrainningPaymentMutation>;
export type CreateTrainningPaymentMutationResult = Apollo.MutationResult<CreateTrainningPaymentMutation>;
export type CreateTrainningPaymentMutationOptions = Apollo.BaseMutationOptions<CreateTrainningPaymentMutation, CreateTrainningPaymentMutationVariables>;
export const GetTrainningPaymentDocument = gql`
    query GetTrainningPayment($customerId: Float!) {
  GetTrainningPayment(customer_id: $customerId) {
    payment_id
    payment_date
    user_id
    customer_id
    type
    promotion
    price
  }
}
    `;

/**
 * __useGetTrainningPaymentQuery__
 *
 * To run a query within a React component, call `useGetTrainningPaymentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrainningPaymentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrainningPaymentQuery({
 *   variables: {
 *      customerId: // value for 'customerId'
 *   },
 * });
 */
export function useGetTrainningPaymentQuery(baseOptions: Apollo.QueryHookOptions<GetTrainningPaymentQuery, GetTrainningPaymentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTrainningPaymentQuery, GetTrainningPaymentQueryVariables>(GetTrainningPaymentDocument, options);
      }
export function useGetTrainningPaymentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTrainningPaymentQuery, GetTrainningPaymentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTrainningPaymentQuery, GetTrainningPaymentQueryVariables>(GetTrainningPaymentDocument, options);
        }
export type GetTrainningPaymentQueryHookResult = ReturnType<typeof useGetTrainningPaymentQuery>;
export type GetTrainningPaymentLazyQueryHookResult = ReturnType<typeof useGetTrainningPaymentLazyQuery>;
export type GetTrainningPaymentQueryResult = Apollo.QueryResult<GetTrainningPaymentQuery, GetTrainningPaymentQueryVariables>;
export const GetTranningPriceDocument = gql`
    query GetTranningPrice {
  GetTranningPrice {
    id
    name
    type
    month_qty
    price
  }
}
    `;

/**
 * __useGetTranningPriceQuery__
 *
 * To run a query within a React component, call `useGetTranningPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTranningPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTranningPriceQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTranningPriceQuery(baseOptions?: Apollo.QueryHookOptions<GetTranningPriceQuery, GetTranningPriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTranningPriceQuery, GetTranningPriceQueryVariables>(GetTranningPriceDocument, options);
      }
export function useGetTranningPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTranningPriceQuery, GetTranningPriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTranningPriceQuery, GetTranningPriceQueryVariables>(GetTranningPriceDocument, options);
        }
export type GetTranningPriceQueryHookResult = ReturnType<typeof useGetTranningPriceQuery>;
export type GetTranningPriceLazyQueryHookResult = ReturnType<typeof useGetTranningPriceLazyQuery>;
export type GetTranningPriceQueryResult = Apollo.QueryResult<GetTranningPriceQuery, GetTranningPriceQueryVariables>;