import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const DATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;

export class SignupDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(5)
  phoneNumber!: string;

  @IsOptional()
  @IsIn(['male', 'female', 'non_binary', 'prefer_not_to_say'])
  gender?: string;

  @Matches(DATE_REGEX, { message: 'dateOfBirth must be in MM/DD/YYYY format' })
  dateOfBirth!: string;

  @IsOptional()
  @IsString()
  avatarUri?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  cookingLevel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisines?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietary?: string[];

  @IsString()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
