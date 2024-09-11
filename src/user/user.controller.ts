import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { GenericResponseDto } from 'src/Common/generic-response.dto';
import { UserDataResponse } from 'src/types/user.types';


@Controller('api/user')
export class UserController {
    private static readonly validAgentTokens = ['eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6InN1cGVyYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJCdXNpbmVzcyIsImV4cCI6MTcxNzk4Njc3N30.JpaLVnT8SwMXzLntG_BzWF7TmRkEHdTMVCaj0f8AP9M', 'valid-agent-token-2'];
    private static readonly validNumbers = ['01010101010', '01111111111'];

    @Post('get-user-data')
    getUserData(@Body() userData: { mobileNumber: string }, @Headers('authorization') authHeader: string): GenericResponseDto<UserDataResponse> {
        // Check for valid agent token
        const token = authHeader?.split(' ')[1];
        if (!token || !UserController.validAgentTokens.includes(token)) {
            throw new UnauthorizedException();
        }
        const isValid = UserController.validNumbers.includes(userData.mobileNumber);

        if (isValid) {
            const response: UserDataResponse = {
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
                    phoneNumber: '01234567890'
                },
                isTopup: true,
                nidFrontUrl: 'https://support.fxgm.com/hc/article_attachments/360007170598/ID-front-EN.png',
                nidBackUrl: 'https://support.fxgm.com/hc/article_attachments/360007088117/ID-back-EN.png',
                userToken: 'user-token-12345'
            };
            return new GenericResponseDto(true, null, response);
        }
        else {
            return new GenericResponseDto(false, "invalid mobile number", null);
        }
    }
}