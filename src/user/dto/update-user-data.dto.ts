import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDataDto {
    @IsString()
    @IsOptional()
    aName: string;

    @IsString()
    @IsOptional()
    eName: string;

    @IsString()
    @IsOptional()
    workAddress?: string;

    @IsString()
    @IsOptional()
    workOccupation?: string;

    @IsString()
    @IsOptional()
    nidAddress: string;

    @IsString()
    userToken: string;
}