import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GenericResponseDto } from '../Common/generic-response.dto';
import { UserDataResponse, OcrNidData } from '../types/user.types';
import { UpdateUserDataDto } from '../user/dto/update-user-data.dto';

@Injectable()
export class UserService {
    private readonly agentBaseUrl: string;
    private readonly authToken: string = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJadWltN05ieHlUSVRpYk1LOEhzQkdXNWIwVjFXWGRGVGxXaUI4bDE0aHQwIn0.eyJleHAiOjE3MjY5Mzc0ODcsImlhdCI6MTcyNjkzNzE4NywianRpIjoiOGNlNTc3ZmQtM2Q3OC00MGYxLWJkYTAtOTc4ZGI5Mjc5MzdiIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5jYXNoZmxvd2VnLmNvbS9yZWFsbXMvY2FzaGZsb3ctZmluYW5jZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJmZjk4YjMwZS1jZjhmLTQ0MTUtYjFiNS1jMmMwNTMzN2RhZWIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJlLXdhbGxldCIsInNpZCI6IjdiMWIzZjYxLWFiOGItNGJmNS1iNGE1LTNlOWM5YzNiYTAzOSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtY2FzaGZsb3ctZmluYW5jZSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJhZG1pbiBhZG1pbiIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwiZ2l2ZW5fbmFtZSI6ImFkbWluIiwiZmFtaWx5X25hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AMTIzNDU2LmNvbSJ9.h5CE0G12eYLurilMYl3apsEAJTjZ5RZctPV_tMIrhxSrMG613ih8ZuvckckeB2c3hgO9h9Lvz9e6rqG-V1WWuZ9UzJ4GQH-CStxpM1WHaESkPjIc_RiYNTKlveGWKPqcEIUiu8V7dKsomiLU6CRy-9GQWHZo3H8Ptn3PgNGCJ4UBhovPqJ-92KuBFOGqkqICQOGBbuVfwvBuouC4fyWV7zHsbZnr5ml0rGT7_umwY9CwJHRBPEktTSKmlk5JvqQcFtTckebZ_WIwRvRpIdKbwfMmJlKG9QHYXmOexC8i93smOsUoBa_JUxJVUk6ztHH0B0_WxDD4B6jjFvz3nw1FIw';

    constructor(
        private readonly httpService: HttpService, // Use HttpService from @nestjs/axios
    ) {
        this.agentBaseUrl = 'https://api.ultratech-plus.com/secure/agent';
    }

    async profile(reference: string, type: string): Promise<GenericResponseDto<UserDataResponse>> {
        try {
            const url = `${this.agentBaseUrl}/api/customer/profile`;
            console.log(reference, type)
            const response = await firstValueFrom(
                this.httpService.post(url, { reference, type }, {
                    headers: {
                        Authorization: `${this.authToken}`
                    }
                })
            );
            console.log(response.data);
            const mappedResponse = this.mapToUserDataResponse(response.data)
            if (response.status === 200 && response.data.status === 'success') {
                return new GenericResponseDto(
                    true,
                    null,
                    mappedResponse,
                );
            } else {
                return new GenericResponseDto(false, 'Failed to get profile data', null);
            }
        } catch (error) {
            console.log(error)
            return new GenericResponseDto(false, 'Failed to get profile data', null);
        }
    }

    async updateProfileData(dto: UpdateUserDataDto): Promise<GenericResponseDto<boolean>> {
        try {
            const url = `${this.agentBaseUrl}/api/customer/update`;

            const payload = {
                businessId: dto.userToken,
                firstName: dto.aName,
                fullName: dto.aName,
                englishFirstName: dto.eName,
                englishFullName: dto.eName,
                workAddress: dto.workAddress || '',
                workOccupation: dto.workOccupation || '',
                natIDAddress: dto.nidAddress,
            };

            const response = await firstValueFrom(
                this.httpService.put(url, payload , {
                    headers: {
                        Authorization: `123`
                    }
                })
            );
            if (response.status === 200 && response.data.status === 'success') {
                return new GenericResponseDto(
                    true,
                    null,
                    true,
                );
            } else {
                return new GenericResponseDto(false, 'Failed to update profile data', null);
            }
        } catch (error) {
            console.log(error)
            return new GenericResponseDto(false, 'Failed to update profile data', null);
        }
    }


    private mapToUserDataResponse(apiResponse: any): UserDataResponse {
        const customerProfile = apiResponse.customerProfile;

        const ocrNidData: OcrNidData = {
            arabicName: customerProfile.arabicName,
            englishName: customerProfile.englishName || '',
            nidNumber: customerProfile.natIDNumber,
            nationality: 'Egyptian', // Assuming nationality is 'Egyptian' since it's not in the response
            address: customerProfile.address,
            gender: customerProfile.gender,
            workOccupation: customerProfile.workOccupation || '',
            workAddress: customerProfile.workAddress || '',
            birthdate: customerProfile.birthdate,
            placeOfBirth: customerProfile.placeOfBirth,
            phoneNumber: customerProfile.mobileNumber,
        };

        return {
            ocrNidData: ocrNidData,
            isTopup: false, // Assuming false for now, unless derived from the business logic
            nidFrontUrl: customerProfile.nidFrontUrl,
            nidBackUrl: customerProfile.nidBackUrl,
            userToken: customerProfile.businessId,
        };
    }
}