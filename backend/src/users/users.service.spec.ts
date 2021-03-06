import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { JwtService } from 'src/jwt/jwt.service'
import { MailService } from 'src/mail/mail.service'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { Verification } from './entities/verification.entity'
import { UserService } from './users.service'

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
})

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
}

const mockMailService = {
  sendVerificationEmail: jest.fn(),
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

describe('UserService', () => {
  let service: UserService
  let usersRepository: MockRepository<User>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile()
    service = module.get<UserService>(UserService)
    usersRepository = module.get(getRepositoryToken(User))
  })

  it('should de defined', () => {
    expect(service).toBeDefined()
  })

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    }

    it('should fail if user exists.', async () => {
      usersRepository.findOne.mockReturnValue({
        id: 8,
        email: 'tkhwang@gmail.com',
      })
      const result = await service.createAccount(createAccountArgs)

      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      })
    })

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockReturnValue(undefined)
      usersRepository.create.mockReturnValue(createAccountArgs)

      const result = await service.createAccount(createAccountArgs)

      expect(usersRepository.create).toHaveBeenCalledTimes(1)
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs)
      expect(usersRepository.save).toHaveBeenCalledTimes(1)
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs)
      expect(usersRepository.create).toHaveBeenCalledTimes(1)
      expect(usersRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      })
    })
  })

  it.todo('login')
  it.todo('findById')
  it.todo('editProfile')
  it.todo('verifyEmail')
})
