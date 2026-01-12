export interface Photo {
    url: string;
    order: number;
}

export interface Interest {
    interest: string;
}

export interface EducationPreference {
    education: string;
}

export interface LocationPreference {
    location: string;
}

export interface Preferences {
    preferredEducation: EducationPreference[];
    preferredReligion: string;
    ageMin: number;
    preferredLocations: LocationPreference[];
    ageMax: number;
}

export interface FamilyDetails {
    siblings: string;
    familyType: string;
    fatherOccupation: string;
    motherOccupation: string;
}

export interface DiscoveryProfile {
    userId: string;
    fullName: string;
    age: number;
    location: string;
    bio: string;
    community: string;
    profession: string;
    education: string;
    religion: string;
    photos: Photo[];
    interests: Interest[];
    preferences: Preferences;
    familyDetails: FamilyDetails;
    isLiked: boolean;
    isPassed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DiscoveryResponse {
    data: DiscoveryProfile[];
}
