export interface Photo {
    title?: string;
    date?: string;
    orientation?: string;
    album?: string;
    id: number;
    url: string;
    name?: string;
    description?: string;
    albumId?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Album {
    id: string;
    name: string;
}

// Type for photo filtering criteria
export interface FilterCriteria {
    album?: string;
    tag?: string | null;
    searchTerm?: string;
}

// Modal state type to manage various modals in the app
export interface ModalState {
    isTagModalOpen: boolean;
    isPhotoTagModalOpen: boolean;
    isAlbumModalOpen: boolean;
    isShareModalOpen: boolean;
    isUploadModalOpen: boolean;
}
