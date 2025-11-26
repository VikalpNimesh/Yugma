import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BasicInfoForm = {
  fullName: string;
  age: string;
  location: string;
  profession: string;
  education: string;
  religion: string;
  community: string;
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
};

const initialState: ProfileFormState = {
  basicInfo: {
    fullName: '',
    age: '',
    location: '',
    profession: '',
    education: '',
    religion: '',
    community: '',
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
  },
  preferences: {
    preferredAgeMin: '',
    preferredAgeMax: '',
    preferredLocations: '',
    preferredEducation: '',
  },
  currentScreen: null,
};

const profileFormSlice = createSlice({
  name: 'profileForm',
  initialState,
  reducers: {
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
});

export const {
  updateBasicInfo,
  updateAboutYou,
  updateFamilyDetails,
  updatePreferences,
  setCurrentScreen,
  resetProfileForm,
} = profileFormSlice.actions;

export default profileFormSlice.reducer;
