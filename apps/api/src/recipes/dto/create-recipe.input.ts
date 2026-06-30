import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateRecipeInput {
  @Field()
  @IsString()
  @MinLength(1)
  title!: string;

  @Field()
  @IsString()
  @MinLength(1)
  description!: string;

  @Field({ defaultValue: 30 })
  @IsInt()
  @IsPositive()
  prepTimeMinutes!: number;
}
