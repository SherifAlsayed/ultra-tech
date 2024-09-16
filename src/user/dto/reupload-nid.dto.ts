import { IsString } from 'class-validator';
export class ReuploadNidDto {

    @IsString()
    nidFront: string;

    @IsString()
    nidBack: string;

    @IsString()
    userToken: string;
}