import { useState, useEffect, useCallback } from 'react';
import { ModalState } from '@/app/types';

/**
 * Hook for managing modal states
 *
 * @returns Object containing modal state and functions to manipulate them
 */
export default function useModalState() {
    // Initial modal state
    const initialState: ModalState = {
        isTagModalOpen: false,
        isPhotoTagModalOpen: false,
        isAlbumModalOpen: false,
        isShareModalOpen: false,
        isUploadModalOpen: false,
    };

    const [modalState, setModalState] = useState<ModalState>(initialState);

    // Handle ESC key press to close modals
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                // Close all open modals
                if (modalState.isTagModalOpen) {
                    setModalState((prev) => ({ ...prev, isTagModalOpen: false }));
                }
                if (modalState.isPhotoTagModalOpen) {
                    setModalState((prev) => ({ ...prev, isPhotoTagModalOpen: false }));
                }
                if (modalState.isAlbumModalOpen) {
                    setModalState((prev) => ({ ...prev, isAlbumModalOpen: false }));
                }
                if (modalState.isShareModalOpen) {
                    setModalState((prev) => ({ ...prev, isShareModalOpen: false }));
                }
                if (modalState.isUploadModalOpen) {
                    setModalState((prev) => ({ ...prev, isUploadModalOpen: false }));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalState]);

    // Functions to open/close specific modals
    const openTagModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isTagModalOpen: true }));
    }, []);

    const closeTagModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isTagModalOpen: false }));
    }, []);

    const openPhotoTagModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isPhotoTagModalOpen: true }));
    }, []);

    const closePhotoTagModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isPhotoTagModalOpen: false }));
    }, []);

    const openAlbumModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isAlbumModalOpen: true }));
    }, []);

    const closeAlbumModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isAlbumModalOpen: false }));
    }, []);

    const openShareModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isShareModalOpen: true }));
    }, []);

    const closeShareModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isShareModalOpen: false }));
    }, []);

    const openUploadModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isUploadModalOpen: true }));
    }, []);

    const closeUploadModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isUploadModalOpen: false }));
    }, []);

    // Close all modals at once
    const closeAllModals = useCallback(() => {
        setModalState(initialState);
    }, []);

    return {
        modalState,
        openTagModal,
        closeTagModal,
        openPhotoTagModal,
        closePhotoTagModal,
        openAlbumModal,
        closeAlbumModal,
        openShareModal,
        closeShareModal,
        openUploadModal,
        closeUploadModal,
        closeAllModals,
    };
}
