export interface OcrNidData {
    arabicName: string;
    englishName: string;
    nidNumber: string;
    nationality: string;
    address: string;
    gender: string;
    workOccupation: string;
    workAddress: string;
    birthdate: string;
    placeOfBirth: string;
    phoneNumber: string;
  }

  export interface UserDataResponse {
    ocrNidData: OcrNidData;
    isTopup: boolean;
    nidFrontUrl: string;
    nidBackUrl: string;
    userToken: string;
  }