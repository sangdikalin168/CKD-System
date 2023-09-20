import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { TicketPayment } from "../Entities/TicketPayment";

@InterfaceType()
export abstract class TicketPaymentResponse {

    @Field()
    payment_id: number;

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: TicketPaymentResponse })
export class TicketPaymentMutationResponse implements TicketPaymentResponse {
    payment_id: number;
    code: number;
    success: boolean;
    message?: string;
}

@Resolver()
export class TicketPaymentResolver {

    @Mutation((_return) => TicketPaymentMutationResponse)
    async CreateTicketPayment(
        @Arg("user_id") user_id: number,
        @Arg("price") price: number,
        @Arg("ticket_code") ticket_code: string,
    ): Promise<TicketPaymentMutationResponse> {
        const result = await TicketPayment.create({
            user_id: user_id,
            ticket_code: ticket_code,
            price: price,
        }).save();

        if (result.payment_id) {
            return {
                payment_id: result.payment_id,
                code: 200,
                success: true,
                message: "Ticket Insert Success",
            };
        }

        //Return Failed
        return {
            payment_id: 0,
            code: 200,
            success: false,
            message: "Invoice Create Failed",
        };

    }
}