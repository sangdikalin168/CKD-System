import { Field, ObjectType } from "type-graphql";

/**
 * Shared base for `{ payment_id, code, success, message }` payment responses.
 * `isAbstract: true` => the base isn't its own GraphQL type; each payment
 * resolver's response just `extends` this, keeping its existing type name while
 * defining the fields only once.
 */
@ObjectType({ isAbstract: true })
export abstract class PaymentMutationResponseBase {
    @Field()
    payment_id: number;

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}
