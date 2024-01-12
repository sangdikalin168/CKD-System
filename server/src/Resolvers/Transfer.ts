import { Customer } from "../Entities/Customer";
import { Transfer } from "../Entities/Transfer";
import { TransferRequest } from "../Entities/TransferRequest";
import { Arg, Field, InterfaceType, Mutation, ObjectType, Query, Resolver } from "type-graphql";


@InterfaceType()
export abstract class TransferResponse {
    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: TransferResponse })
export class TransferMutationResponse implements TransferResponse {
    code: number;
    success: boolean;
    message?: string;
    transfer_id?: number;
}

@ObjectType()
export class TransferJoin extends TransferRequest {
    @Field()
    display_name: string;

    @Field()
    sender_name: string;

    @Field()
    sender_phone: string;

    @Field()
    sender_old_end: string;

    @Field()
    receiver_name: string;

    @Field()
    receiver_phone: string;

    @Field()
    receiver_old_end: string;


    @Field({ nullable: true })
    checker_name: string;

    @Field({ nullable: true })
    approver_name: string;

    @Field({ nullable: true })
    processed_name: string;
}

const NOW = new Date().toLocaleString("sv-SE").replace(/,/g, "");


@Resolver()
export class TransferResolver {

    @Query((_return) => [TransferJoin])
    async TransferRequests() {
        const result = await TransferRequest.query(`
        SELECT request_id,request_by,users.display_name,request_date,reason,
        sender_id,sender.customer_name as sender_name, sender.phone as sender_phone,sender.end_membership_date as sender_old_end,
        receiver_id,receiver.customer_name as receiver_name, receiver.phone as receiver_phone,receiver.end_membership_date as receiver_old_end,
        checker_comment,checked_date,checker_status,checked_by,checker.display_name as checker_name,
        approver_comment,approved_date,approver_status,approved_by,approver.display_name as approver_name,
        processed_by,procced.display_name as processed_name,process
        FROM transfer_request tr
        INNER JOIN users ON users.user_id = request_by
        LEFT JOIN users procced ON tr.processed_by = procced.user_id
        LEFT JOIN users checker ON tr.checked_by = checker.user_id
        LEFT JOIN users approver ON tr.approved_by = approver.user_id
        INNER JOIN customer sender ON tr.sender_id = sender.customer_id
        INNER JOIN customer receiver ON tr.receiver_id = receiver.customer_id;
        `)
        return JSON.parse(JSON.stringify(result));
    }

    @Mutation((_return) => TransferMutationResponse)
    async CreateTransferRequest(
        @Arg("request_by") request_by: number,
        @Arg("sender_id") sender_id: number,
        @Arg("receiver_id") receiver_id: number,
        @Arg("reason") reason: string,
    ): Promise<TransferMutationResponse> {
        await TransferRequest.create({
            request_by: request_by,
            reason: reason,
            sender_id: sender_id,
            receiver_id: receiver_id,
        }).save();

        return {
            code: 200,
            success: true,
            message: "Create Success",
        };
    }

    @Mutation((_return) => TransferMutationResponse)
    async CheckTransferRequest(
        @Arg("request_id") request_id: number,
        @Arg("checked_by") checked_by: number,
        @Arg("checker_comment") checker_comment: string,
        @Arg("checker_status") checker_status: string
    ): Promise<TransferMutationResponse> {
        await TransferRequest.update({
            request_id: request_id
        }, {
            checker_comment: checker_comment,
            checked_by: checked_by,
            checked_date: NOW,
            checker_status: checker_status
        })

        return {
            code: 200,
            success: true,
            message: "Success",
        };
    }

    @Mutation((_return) => TransferMutationResponse)
    async ApproveTransferRequest(
        @Arg("request_id") request_id: number,
        @Arg("approved_by") approved_by: number,
        @Arg("approver_comment") approver_comment: string,
        @Arg("approver_status") approver_status: string,
    ): Promise<TransferMutationResponse> {
        await TransferRequest.update({
            request_id: request_id
        }, {
            approved_by: approved_by,
            approved_date: NOW,
            approver_comment: approver_comment,
            approver_status: approver_status
        })

        return {
            code: 200,
            success: true,
            message: "Success",
        };
    }

    @Mutation((_return) => TransferMutationResponse)
    async CreateTransfer(
        @Arg("request_id") request_id: number,
        @Arg("processed_by") processed_by: number,
        @Arg("sender_id") sender_id: number,
        @Arg("sender_old_date") sender_old_date: string,
        @Arg("sender_new_end") sender_new_end: string,
        @Arg("receiver_id") receiver_id: number,
        @Arg("receiver_old_end") receiver_old_end: string,
        @Arg("receiver_new_end") receiver_new_end: string,
    ): Promise<TransferMutationResponse> {
        const res = await Transfer.create({
            request_id: request_id,
            transfer_by: 1,
            sender_id: 1,
            sender_old_date: sender_old_date,
            sender_new_end: sender_new_end,
            receiver_id: receiver_id,
            receiver_old_end: receiver_old_end,
            receiver_new_end: receiver_new_end,
            fee: 1
        }).save();

        if (res.transfer_id) {
            const update_sender = await Customer.update({
                customer_id: sender_id,
            }, {
                end_membership_date: sender_new_end
            })

            if (update_sender.affected) {
                const update_receiver = await Customer.update({
                    customer_id: receiver_id,
                }, {
                    end_membership_date: receiver_new_end
                })

                const update_request = await TransferRequest.update({
                    request_id: request_id
                }, {
                    process: "Done",
                    processed_by: processed_by
                })

                return {
                    code: 200,
                    success: true,
                    message: "Update Member Success",
                    transfer_id: res.transfer_id
                };
            }
        }

        return {
            code: 200,
            success: false,
            message: "Failed",
        };
    }
}