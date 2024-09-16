import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { GenericResponseDto } from '../Common/generic-response.dto';
import { OtpValidationResponse } from '../types/auth.types';


@Controller('api/auth')
export class AuthController {

    private static readonly validNumbers = ['01010101010', '01111111111'];
    private static readonly validOtps = ['123456', '654321'];
    private static checkNumber(number: string): boolean {
        return this.validNumbers.includes(number);
    }


    @Post('login')
    @HttpCode(200)
    login(@Body() loginDto: { mobileNumber: string }): GenericResponseDto<boolean> {

        const isNumberValid = AuthController.checkNumber(loginDto.mobileNumber);

        return new GenericResponseDto(
            isNumberValid,
            isNumberValid ? null : 'User does not exist',
            isNumberValid
        );
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