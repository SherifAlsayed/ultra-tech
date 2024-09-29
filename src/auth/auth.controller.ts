import { Controller, Post, Body, HttpCode, HttpException } from '@nestjs/common';
import { AgentService } from '../core-system/agent.service';
import { GenericResponseDto } from '../Common/generic-response.dto';
import { OtpValidationResponse } from '../types/auth.types';


@Controller('api/auth')
export class AuthController {

    private static readonly validNumbers = ['01010101010', '01111111111'];
    private static readonly validOtps = ['123456', '654321'];
    private static checkNumber(number: string): boolean {
        return this.validNumbers.includes(number);
    }
    constructor(private readonly agentService: AgentService) { }



    @Post('login')
    @HttpCode(200)
    async requestOtp(@Body('mobileNumber') mobileNumber: string): Promise<GenericResponseDto<any>> {
        try {
            // Call the AgentService to request OTP
            return await this.agentService.requestOtp(mobileNumber);
        } catch (error) {
            console.log(error)
            throw new HttpException('Unable to process OTP request', error.status || 500);
        }
    }

    @Post('validate-otp')
    @HttpCode(200)
    async validatet_Otp(@Body() otpData: { otp: string; mobileNumber: string }): Promise<GenericResponseDto<any>> {
        try {
            // Call the AgentService to request OTP
            return await this.agentService.validateOtp(otpData.mobileNumber, otpData.otp);
        } catch (error) {
            console.log(error)
            throw new HttpException('Unable to process OTP request', error.status || 500);
        }
    }

    @Post('validate-otp')
    @HttpCode(200)
    validateOtp(@Body() otpData: { otp: string; mobileNumber: string }): GenericResponseDto<OtpValidationResponse> {
        const isValid = AuthController.validOtps.includes(otpData.otp) &&
            AuthController.validNumbers.includes(otpData.mobileNumber);

        if (isValid) {
            const response: OtpValidationResponse = {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                fullName: 'John Doe',
                branchName: 'Main Branch',
                branchAddress: '123 Main St, City, Country',
                branchLat: 40.7128,
                branchLong: -74.0060
            };

            return new GenericResponseDto(true, null, response);
        } else {
            return new GenericResponseDto(false, 'Invalid OTP or mobile number', null);
        }
    }
    @Post('resend-otp')
    @HttpCode(200)
    resendOtp(@Body() resendData: { mobileNumber: string }): GenericResponseDto<boolean> {
        const isValidMobileNumber = AuthController.validNumbers.includes(resendData.mobileNumber);

        if (isValidMobileNumber) {
            return new GenericResponseDto(true, null, isValidMobileNumber);
        } else {
            return new GenericResponseDto(false, 'Failed to resend OTP. Invalid mobile number.', isValidMobileNumber);
        }
    }

}