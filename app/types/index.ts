export type Photo = {
    id: number;
    album: string;
    url: string;
    title: string;
    description: string;
    date: string;
    orientation: string;
    tags?: string[];
};

export type Tag = {
    id: string;
    name: string;
    color: string;
};

export type Album = {
    id: string;
    name: string;
};

// Type for photo filtering criteria
export type FilterCriteria = {
    album?: string;
    tag?: string | null;
    searchTerm?: string;
};

// Modal state type to manage various modals in the app
export type ModalState = {
    isTagModalOpen: boolean;
    isPhotoTagModalOpen: boolean;
    isAlbumModalOpen: boolean;
    isShareModalOpen: boolean;
    isUploadModalOpen: boolean;
};
