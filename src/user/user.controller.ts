import { Controller, Post, Body, Headers, UnauthorizedException, HttpCode, Res } from '@nestjs/common';
import { GenericResponseDto } from '../Common/generic-response.dto';
import { UserDataResponse } from '../types/user.types';
import { UpdateUserDataDto } from './dto/update-user-data.dto';
import { ReuploadNidDto } from './dto/reupload-nid.dto';
import { Response } from 'express';
import { PdfGeneratorService } from '../pdf/pdf-generator.service';
import { UserService } from '../core-system/user.service';



@Controller('api/user')
export class UserController {
    private static readonly validAgentTokens = ['eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6InN1cGVyYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJCdXNpbmVzcyIsImV4cCI6MTcxNzk4Njc3N30.JpaLVnT8SwMXzLntG_BzWF7TmRkEHdTMVCaj0f8AP9M', 'valid-agent-token-2'];
    private static readonly validNumbers = ['01010101010', '01111111111'];
    private static readonly validUserTokens = ['ValidUserToken1', 'ValidUserToken2'];

    constructor(private readonly pdfGeneratorService: PdfGeneratorService, private readonly userService: UserService) { }


    @Post('get-user-data')
    @HttpCode(200)
    async getUserData(@Body() userData: { mobileNumber: string }, @Headers('authorization') authHeader: string): Promise<GenericResponseDto<UserDataResponse>> {
        // Check for valid agent token
        const token = authHeader?.split(' ')[1];
        if (!token || !UserController.validAgentTokens.includes(token)) {
            throw new UnauthorizedException();
        }
        try {
            return await this.userService.profile(userData.mobileNumber, 'MOBILE')
        } catch (error) {
            return new GenericResponseDto(false, "Internal Server Error", null);
        }
    }

    @Post('update-user-data')
    @HttpCode(200)
    async updateUserData(@Body() updateData: UpdateUserDataDto, @Headers('authorization') authHeader: string): Promise<GenericResponseDto<boolean>> {
        const token = authHeader?.split(' ')[1];
        if (!token || !UserController.validAgentTokens.includes(token)) {
            throw new UnauthorizedException();
        }
        try {
            return await this.userService.updateProfileData(updateData)
        } catch (error) {
            return new GenericResponseDto(false, "Internal Server Error", null);
        }
    }

    @Post('reupload-nid')
    @HttpCode(200)
    ReuploadNid(@Body() updateData: ReuploadNidDto, @Headers('authorization') authHeader: string): GenericResponseDto<boolean> {
        const token = authHeader?.split(' ')[1];
        if (!token || !UserController.validAgentTokens.includes(token)) {
            throw new UnauthorizedException();
        }

        if (!updateData.userToken || !UserController.validUserTokens.includes(updateData.userToken)) {
            return new GenericResponseDto(false, "invalid user token", false);
        }
        return new GenericResponseDto(true, null, true);
    }

    @Post('get-kyc-doc')
    @HttpCode(200)
    GetKYCDoc(@Body() userData: { userToken: string }, @Headers('authorization') authHeader: string, @Res() res: Response): GenericResponseDto<boolean> | void {
        const token = authHeader?.split(' ')[1];
        if (!token || !UserController.validAgentTokens.includes(token)) {
            throw new UnauthorizedException();
        }

        // if (!userData.userToken || !UserController.validUserTokens.includes(userData.userToken)) {
        //     return new GenericResponseDto(false, "invalid user token", false);
        // }
        const mockUserData = {
            ocrNidData: {
                arabicName: 'محمد أحمد',
                englishName: 'Mohammed Ahmed',
                nidNumber: '1234567890',
                nationality: 'Egyptian',
                address: 'Cairo, Egypt',
                gender: 'Male',
                workOccupation: 'Engineer',
                workAddress: 'Tech Company, Alexandria',
                birthdate: '1990-01-01',
                placeOfBirth: 'Alexandria',
                phoneNumber: '01234567890',
            },
        };

        // Call the service to generate the PDF, and stream it back in the response
        this.pdfGeneratorService.generateKycPdf(mockUserData, res);
    }
}