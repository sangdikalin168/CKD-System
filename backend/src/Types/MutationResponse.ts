import { Field, ObjectType } from 'type-graphql'

/**
 * Shared base for the common `{ code, success, message }` mutation response.
 * `isAbstract: true` => not emitted as its own GraphQL type; subclasses inherit
 * the fields, so each resolver's response is a one-line `extends` instead of a
 * copy-pasted field block.
 */
@ObjectType({ isAbstract: true })
export abstract class MutationResponseBase {
	@Field()
	code: number

	@Field()
	success: boolean

	@Field({ nullable: true })
	message?: string
}
