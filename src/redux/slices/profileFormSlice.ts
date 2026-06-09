import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import profileService from '../../api/services/profileService';

type BasicInfoForm = {
  fullName: string;
  email: string;
  age: string;
  location: string;
  profession: string;
  education: string;
  region: string;
  areaCover: string; // Premium feature
  gender: string;
};

type AboutYouForm = {
  bio: string;
  interests: string[];
  photos: string[];
};

type FamilyDetailsForm = {
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  numberOfBrothers: string;
  numberOfSisters: string;
  siblingsMaritalStatus: string;
};

type PreferencesForm = {
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredLocations: string;
  preferredEducation: string;
};

export type ProfileFormState = {
  basicInfo: BasicInfoForm;
  aboutYou: AboutYouForm;
  familyDetails: FamilyDetailsForm;
  preferences: PreferencesForm;
  currentScreen: string | null;
  // async profile update status
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateError?: string;
};

const initialState: ProfileFormState = {
  basicInfo: {
    fullName: '',
    email: '',
    age: '',
    location: '',
    profession: '',
    education: '',
    region: '',
    areaCover: '',
    gender: '',
  },
  aboutYou: {
    bio: '',
    interests: [],
    photos: [],
  },
  familyDetails: {
    fatherOccupation: '',
    motherOccupation: '',
    siblings: '',
    familyType: '',
    numberOfBrothers: '',
    numberOfSisters: '',
    siblingsMaritalStatus: '',
  },
  preferences: {
    preferredAgeMin: '',
    preferredAgeMax: '',
    preferredLocations: '',
    preferredEducation: '',
  },
  currentScreen: null,
  updateStatus: 'idle',
  updateError: undefined,
};

const getMimeType = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};

// Async Thunk for completing profile
export const completeProfile = createAsyncThunk(
  'profileForm/completeProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const profile = state.profileForm;

      // Step 1: Update profile details via JSON
      const payload = {
        userId: profile.basicInfo.fullName, // placeholder, replace with actual user ID
        fullName: profile.basicInfo.fullName,
        age: Number(profile.basicInfo.age),
        location: profile.basicInfo.location,
        profession: profile.basicInfo.profession,
        education: profile.basicInfo.education,
        religion: 'Hindu',
        caste: 'Brahmin',
        community: profile.basicInfo.areaCover,
        gender: profile.basicInfo.gender || state.user?.gender || 'Male',
        bio: profile.aboutYou.bio,
        interests: profile.aboutYou.interests.map((i: any) => ({ interest: i })),
        familyDetails: profile.familyDetails,
        preferences: {
          ageMin: Number(profile.preferences.preferredAgeMin),
          ageMax: Number(profile.preferences.preferredAgeMax),
          preferredLocations: profile.preferences.preferredLocations.split(',').map((l: string) => ({ location: l.trim() })),
          preferredEducation: profile.preferences.preferredEducation.split(',').map((e: string) => ({ education: e.trim() })),
        }
      };

      console.log('completeProfile: JSON update start');
      const response = await profileService.updateProfile(payload);
      console.log('completeProfile: JSON update finished');

      // Step 2: If photos exist, upload them via multipart/form-data
      const localPhotos = profile.aboutYou.photos;
      if (localPhotos && localPhotos.length > 0) {
        console.log('completeProfile: Multipart update start');
        const formData = new FormData();

        // profilePhoto (first image)
        const profilePhotoUri = localPhotos[0];
        const profilePhotoName = profilePhotoUri.substring(profilePhotoUri.lastIndexOf('/') + 1) || 'profile.jpg';
        const profilePhotoType = getMimeType(profilePhotoName);

        formData.append('profilePhoto', {
          uri: profilePhotoUri,
          name: profilePhotoName,
          type: profilePhotoType,
        } as any);

        // gallery photos (remaining images)
        const galleryPhotos = localPhotos.slice(1);
        galleryPhotos.forEach((photoUri: string, idx: number) => {
          const filename = photoUri.substring(photoUri.lastIndexOf('/') + 1) || `photo_${idx}.jpg`;
          const type = getMimeType(filename);
          formData.append('photos', {
            uri: photoUri,
            name: filename,
            type: type,
          } as any);
        });

        const multipartResponse = await profileService.updateProfileMultipart(formData);
        console.log('completeProfile: Multipart update finished');
        return multipartResponse;
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

const profileFormSlice = createSlice({
  name: 'profileForm',
  initialState,
  reducers: {
    initializeBasicInfo: (state, action: PayloadAction<{ fullName: string; email: string }>) => {
      state.basicInfo.fullName = action.payload.fullName;
      state.basicInfo.email = action.payload.email;
    },
    updateBasicInfo: (state, action: PayloadAction<Partial<BasicInfoForm>>) => {
      state.basicInfo = { ...state.basicInfo, ...action.payload };
    },
    updateAboutYou: (state, action: PayloadAction<Partial<AboutYouForm>>) => {
      state.aboutYou = { ...state.aboutYou, ...action.payload };
    },
    updateFamilyDetails: (
      state,
      action: PayloadAction<Partial<FamilyDetailsForm>>,
    ) => {
      state.familyDetails = { ...state.familyDetails, ...action.payload };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<PreferencesForm>>,
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
    },
    resetProfileForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeProfile.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = undefined;
      })
      .addCase(completeProfile.fulfilled, (state) => {
        state.updateStatus = 'succeeded';
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload as string;
      });
  },
});

export const {
  initializeBasicInfo,
  updateBasicInfo,
  updateAboutYou,
  updateFamilyDetails,
  updatePreferences,
  setCurrentScreen,
  resetProfileForm,
} = profileFormSlice.actions;

export default profileFormSlice.reducer;
