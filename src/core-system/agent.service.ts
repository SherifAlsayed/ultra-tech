import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GenericResponseDto } from '../Common/generic-response.dto';
import { OtpValidationResponse } from '../types/auth.types';

@Injectable()
export class AgentService {
    private readonly agentBaseUrl: string;

    constructor(
        private readonly httpService: HttpService, // Use HttpService from @nestjs/axios
        private readonly configService: ConfigService,
    ) {
        this.agentBaseUrl = 'https://api.ultratech-plus.com/secure/agent';
    }

    async requestOtp(mobileNumber: string): Promise<GenericResponseDto<boolean>> {
        try {
            const url = `${this.agentBaseUrl}/api/agent/request-otp`;

            const response = await firstValueFrom(
                this.httpService.post(url, { mobileNumber })
            );
            console.log(response.data);

            if (response.status === 200 && response.data.status === 'success') {
                return new GenericResponseDto(
                    true,
                    null,
                    true,
                );
            } else {
                return new GenericResponseDto(false, 'Failed to to send OTP', false);
            }
        } catch (error) {
            //console.log(error)
            return new GenericResponseDto(false, 'Failed to send OTP', false);
        }
    }

    async validateOtp(mobileNumber: string, otp: string): Promise<GenericResponseDto<OtpValidationResponse>> {
        try {
            const url = `${this.agentBaseUrl}/api/agent/validate-otp`;

            const response = await firstValueFrom(
                this.httpService.post(url, { mobileNumber, otp })
            );
            console.log(response.data);
            const mappedResponse = this.mapToOtpValidationResponse(response.data);

            if (response.status === 200 && response.data.status === 'success') {
                return new GenericResponseDto(
                    true,
                    null,
                    mappedResponse,
                );
            } else {
                return new GenericResponseDto(false, 'Failed to Validate OTP', null);
            }
        } catch (error) {
            //console.log(error)
            return new GenericResponseDto(false, 'Failed to validate OTP', null);
        }
    }

    private mapToOtpValidationResponse(apiResponse: any): OtpValidationResponse {
        const agentDetails = apiResponse.agentDetails;
        const assignedBranch = agentDetails.assignedBranch;

        return {
            token: apiResponse.accessToken,
            fullName: agentDetails.agentName,
            branchName: assignedBranch.branchName,
            branchAddress: assignedBranch.branchAddress,
            branchLat: assignedBranch.branchLat,
            branchLong: assignedBranch.branchLong,
        };
    }

}