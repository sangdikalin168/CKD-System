import { Field, ObjectType } from 'type-graphql'
import { Users } from '../Entities/Users'
import { IMutationResponse } from './MutationResponse'

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
	code: number
	success: boolean
	message?: string

	@Field({ nullable: true })
	user?: Users

	@Field({ nullable: true })
	accessToken?: string
}