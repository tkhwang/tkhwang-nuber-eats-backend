import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => Boolean)
  hi() {
    return true
  }

  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const error = await this.usersService.createAccount(createAccountInput)
      // error
      if (error) {
        return {
          ok: false,
          error,
        }
      }
      // normal
      return {
        ok: true,
      }
    } catch (error) {
      return {
        ok: false,
        error,
      }
    }
  }
}