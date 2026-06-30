import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class AddCommentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  recipeId?: string;

  @Field()
  @IsString()
  @MinLength(1)
  text!: string;
}
