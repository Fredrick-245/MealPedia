import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class IngredientInput {
  @Field()
  @IsString()
  @MinLength(1)
  text!: string;

  @Field({ defaultValue: '' })
  @IsString()
  emoji!: string;
}

@InputType()
export class InstructionStepInput {
  @Field()
  @IsString()
  @MinLength(1)
  text!: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @ArrayMaxSize(3)
  images!: string[];
}

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

  @Field({ defaultValue: '' })
  @IsString()
  imageUrl!: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @ArrayMaxSize(6)
  galleryUrls!: string[];

  @Field({ defaultValue: '' })
  @IsString()
  cookTime!: string;

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  servings!: number;

  @Field({ defaultValue: '' })
  @IsString()
  origin!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  foodCategory?: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  calories!: number;

  @Field({ defaultValue: false })
  @IsBoolean()
  published!: boolean;

  @Field(() => [IngredientInput], { defaultValue: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientInput)
  ingredients!: IngredientInput[];

  @Field(() => [InstructionStepInput], { defaultValue: [] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionStepInput)
  instructions!: InstructionStepInput[];
}
