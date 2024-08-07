import { Customer } from "../Entities/Customer";
import { Hold } from "../Entities/Hold";
import { HoldRequest } from "../Entities/HoldRequest";
import {
    Arg,
    Field,
    InputType,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";

@InterfaceType()
export abstract class HoldResponse {
    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;

    @Field({ nullable: true })
    hold_id?: number;
}

@ObjectType({ implements: HoldResponse })
export class HoldMutationResponse implements HoldResponse {
    code: number;
    success: boolean;
    message?: string;
    hold_id?: number | undefined;
}

@ObjectType()
export class HoldJoin extends HoldRequest {
    @Field()
    display_name: string;

    @Field()
    customer_name: string;

    @Field()
    phone: string;

    @Field({ nullable: true })
    checker_name: string;

    @Field({ nullable: true })
    approved_name: string;

    @Field({ nullable: true })
    processed_name: string;
}

const NOW = new Date().toLocaleString("sv-SE").replace(/,/g, "");

@Resolver()
export class HoldResolver {

    @Query((_return) => [HoldRequest])
    async GetHoldRequest(@Arg("customer_id") customer_id: number) {
        const result = await HoldRequest.query(`SELECT * FROM hold_request WHERE customer_id = ${customer_id} ORDER BY request_id DESC LIMIT 1;`)
        return JSON.parse(JSON.stringify(result));
    }

    @Query((_return) => [HoldRequest])
    async GetHoldRequestByStatus(@Arg("status") status: number) {
        const result = await HoldRequest.query(`SELECT * FROM hold_request WHERE checker_status = ${status};`)
        return JSON.parse(JSON.stringify(result));
    }

    @Query((_return) => [HoldJoin])
    async HoldRequests() {
        const result = await HoldRequest.query(`SELECT request_id,request_by,display_name,request_date,reason,from_date,to_date,old_end,new_end,customer.customer_id,customer.customer_name,customer.phone, checked_by, (SELECT display_name FROM users WHERE users.user_id = hold_request.checked_by) as checker_name, checker_comment, checked_date, checker_status,approved_by, (SELECT display_name FROM users WHERE users.user_id = hold_request.approved_by) as approved_name, (SELECT display_name FROM users WHERE users.user_id = hold_request.processed_by) as processed_name, processed_by, approver_comment,approved_date,approver_status,process FROM hold_request INNER JOIN customer ON customer.customer_id = hold_request.customer_id INNER JOIN users ON hold_request.request_by = users.user_id ORDER BY request_date DESC;`)
        return JSON.parse(JSON.stringify(result));
    }

    @Mutation((_return) => HoldMutationResponse)
    async CreateHoldRequest(
        @Arg("request_by") request_by: number,
        @Arg("customer_id") customer_id: number,
        @Arg("reason") reason: string,
        @Arg("from_date") from_date: string,
        @Arg("to_date") to_date: string,
        @Arg("old_end") old_end: string,
        @Arg("new_end") new_end: string,
    ): Promise<HoldMutationResponse> {
        await HoldRequest.create({
            request_by: request_by,
            customer_id: customer_id,
            reason: reason,
            from_date: from_date,
            to_date: to_date,
            old_end: old_end,
            new_end: new_end
        }).save();

        return {
            code: 200,
            success: true,
            message: "Create Success",
        };
    }

    @Mutation((_return) => HoldMutationResponse)
    async CheckHoldRequest(
        @Arg("request_id") request_id: number,
        @Arg("checked_by") checked_by: number,
        @Arg("checker_comment") checker_comment: string,
        @Arg("checker_status") checker_status: string
    ): Promise<HoldMutationResponse> {
        await HoldRequest.update({
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

    @Mutation((_return) => HoldMutationResponse)
    async ApproveHoldRequest(
        @Arg("request_id") request_id: number,
        @Arg("approved_by") approved_by: number,
        @Arg("approver_comment") approver_comment: string,
        @Arg("approver_status") approver_status: string,
    ): Promise<HoldMutationResponse> {
        await HoldRequest.update({
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

    @Mutation((_return) => HoldMutationResponse)
    async CreateHold(
        @Arg("request_id") request_id: number,
        @Arg("customer_id") customer_id: number,
        @Arg("new_end") new_end: string,
        @Arg("processed_by") processed_by: number,
    ): Promise<HoldMutationResponse> {
        const res = await Hold.create({
            request_id: request_id,
            fee: 1
        }).save();

        if (res.hold_id) {
            const update = await Customer.update({
                customer_id: customer_id,
            }, {
                end_membership_date: new_end
            })
            if (update.affected) {

                const update_request = await HoldRequest.update({
                    request_id: request_id
                }, {
                    process: "Done",
                    processed_by: processed_by
                })

                return {
                    code: 200,
                    success: true,
                    message: "Update Member Success",
                    hold_id: res.hold_id
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