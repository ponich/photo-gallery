'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Photo, Tag, Album } from './types';
import { mockPhotos, mockTags, mockAlbums } from './mockData';

// Components
import AppLayout from './components/layout/AppLayout';
import PhotoGrid from './components/ui/PhotoGrid';
import PhotoDetailModal from './components/modals/PhotoDetailModal/PhotoDetailModal';
import ShareModal from './components/modals/ShareModal';
import PhotoTagModal from './components/modals/PhotoTagModal';
import TagManagementModal from './components/modals/TagManagementModal';
import AlbumCreationModal from './components/modals/AlbumCreationModal';
import UploadPhotoModal from './components/modals/UploadPhotoModal';
import DropZone from './components/ui/DropZone';

// Hooks
import usePhotoFilter from './hooks/usePhotoFilter';
import useModalState from './hooks/useModalState';
import { useUploadState } from './hooks/useUploadState';

export default function Page() {
    // State for data
    const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
    const [tags, setTags] = useState<Tag[]>(mockTags);
    const [albums, setAlbums] = useState<Album[]>(mockAlbums);
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(mockPhotos);

    // State for UI
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [photoToTag, setPhotoToTag] = useState<Photo | null>(null);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [shareUrl, setShareUrl] = useState('');

    // State for file upload using custom hook
    const {
        uploadedImages,
        setUploadedImages,
        currentImageIndex,
        setCurrentImageIndex,
        photoMetadata,
        setPhotoMetadata,
        updatePhotoTags,
    } = useUploadState();

    const [isDragging, setIsDragging] = useState(false);
    const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({
        title: '',
        description: '',
        album: 'nature',
        tags: [],
        date: new Date().toISOString().split('T')[0],
        orientation: 'landscape',
    });

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom hooks
    const {
        filteredPhotos: photoFilterFilteredPhotos,
        filters: { selectedAlbum, selectedTag, searchTerm },
        setSelectedAlbum,
        setSelectedTag,
        setSearchTerm,
        resetFilters,
    } = usePhotoFilter(photos);

    const {
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
    } = useModalState();

    // Update filteredPhotos when photoFilterFilteredPhotos changes
    useEffect(() => {
        setFilteredPhotos(photoFilterFilteredPhotos);
    }, [photoFilterFilteredPhotos]);

    const handleSearch = useCallback(
        (query: string) => {
            setSearchTerm(query);
        },
        [setSearchTerm],
    );

    // Function to navigate to previous/next photo
    const navigatePhoto = useCallback(
        (direction: 'prev' | 'next') => {
            if (!selectedPhoto) return;

            const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
            if (currentIndex === -1) return;

            let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

            // Loop around if we're at the ends
            if (newIndex >= filteredPhotos.length) newIndex = 0;
            if (newIndex < 0) newIndex = filteredPhotos.length - 1;

            setSelectedPhoto(filteredPhotos[newIndex]);
        },
        [selectedPhoto, filteredPhotos],
    );

    // Handle keyboard navigation and close nested modals
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedPhoto) return;
            const key = e.key;
            // Arrow navigation: close photo tag and share modals, then navigate
            if (key === 'ArrowLeft' || key === 'ArrowRight') {
                if (modalState.isPhotoTagModalOpen) {
                    closePhotoTagModal();
                }
                if (modalState.isShareModalOpen) {
                    closeShareModal();
                }
                navigatePhoto(key === 'ArrowLeft' ? 'prev' : 'next');
            } else if (key === 'Escape') {
                // Close photo tag or share modal first, if open
                if (modalState.isPhotoTagModalOpen) {
                    closePhotoTagModal();
                } else if (modalState.isShareModalOpen) {
                    closeShareModal();
                } else {
                    setSelectedPhoto(null);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        selectedPhoto,
        filteredPhotos,
        modalState.isPhotoTagModalOpen,
        modalState.isShareModalOpen,
        navigatePhoto,
        closePhotoTagModal,
        closeShareModal,
    ]);

    // File handling functions
    const handleFiles = (files: FileList) => {
        if (files && files.length > 0) {
            const newImages: string[] = [];
            const processFile = (index: number) => {
                if (index >= files.length) {
                    // All files have been processed
                    const combinedImages = [...uploadedImages, ...newImages];
                    setUploadedImages(combinedImages);
                    return;
                }

                const file = files[index];
                if (file.type.match('image.*')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target?.result) {
                            newImages.push(e.target.result as string);
                            processFile(index + 1);
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Skip non-image files
                    processFile(index + 1);
                }
            };

            processFile(0);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Add new photos
    const addNewPhotos = (photosToAdd: Photo[]) => {
        if (photosToAdd.length > 0) {
            // Add to photos collection
            setPhotos((prevPhotos) => [...prevPhotos, ...photosToAdd]);

            // Reset form and close modal
            setUploadedImages([]);
            setCurrentImageIndex(0);
            setNewPhoto({
                title: '',
                description: '',
                album: 'nature',
                tags: [],
                date: new Date().toISOString().split('T')[0],
                orientation: 'landscape',
            });
            closeUploadModal();

            // Show feedback
            alert(`${photosToAdd.length} photo(s) added successfully!`);
        }
    };

    // Handler for tag editing
    const handlePhotoTagUpdate = (updatedPhoto: Photo) => {
        setPhotoToTag(updatedPhoto);

        // Also update selectedPhoto if it's the same photo
        if (selectedPhoto && selectedPhoto.id === updatedPhoto.id && updatedPhoto.id !== 0) {
            setSelectedPhoto({ ...updatedPhoto });

            // Update photos collection
            setPhotos((prevPhotos) =>
                prevPhotos.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)),
            );
        }

        // If in upload flow, update photo metadata tags
        if (typeof updatedPhoto.id === 'number' && uploadedImages.length > 0) {
            const photoIndex = updatedPhoto.id;
            if (photoIndex >= 0 && photoIndex < uploadedImages.length) {
                updatePhotoTags(photoIndex, updatedPhoto.tags || []);
            }
        }
    };

    // Handler for creating or updating a tag
    const handleTagSave = (tag: Tag) => {
        setTags((prevTags) => {
            const existing = prevTags.find((t) => t.id === tag.id);
            if (existing) {
                return prevTags.map((t) => (t.id === tag.id ? tag : t));
            }
            return [...prevTags, tag];
        });
    };

    // Handler for deleting a tag
    const handleTagDelete = (tagId: string) => {
        if (window.confirm(`Are you sure you want to delete this tag?`)) {
            setTags((prevTags) => prevTags.filter((t) => t.id !== tagId));

            // Also remove tag from all photos
            setPhotos((prevPhotos) =>
                prevPhotos.map((photo) => ({
                    ...photo,
                    tags: photo.tags?.filter((t) => t !== tagId) || [],
                })),
            );

            // Reset selected tag if it's the deleted one
            if (selectedTag === tagId) {
                setSelectedTag(null);
            }
        }
    };

    // Handler for creating a new album
    const handleAlbumCreate = (album: Album) => {
        setAlbums((prevAlbums) => [...prevAlbums, album]);

        // When we create an album from the upload modal,
        // we'll directly update the newPhoto state
        setNewPhoto((prev) => ({
            ...prev,
            album: album.id,
        }));
    };

    // Handler for deleting an album
    const handleAlbumDelete = (albumId: string) => {
        if (window.confirm(`Are you sure you want to delete this album?`)) {
            setAlbums((prevAlbums) => prevAlbums.filter((a) => a.id !== albumId));

            // Reset selected album if it's the deleted one
            if (selectedAlbum === albumId) {
                setSelectedAlbum('all');
            }
        }
    };

    // Handler for changing a photo's album
    const handlePhotoAlbumChange = (photoId: number, albumId: string) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((p) => (p.id === photoId ? { ...p, album: albumId } : p)),
        );
        setFilteredPhotos((prevFiltered) =>
            prevFiltered.map((p) => (p.id === photoId ? { ...p, album: albumId } : p)),
        );
        if (selectedPhoto?.id === photoId) {
            setSelectedPhoto({ ...selectedPhoto, album: albumId });
        }
    };

    // Handler for updating a photo's details
    const handlePhotoUpdate = (updatedPhoto: Photo) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)),
        );
        setFilteredPhotos((prevFiltered) =>
            prevFiltered.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)),
        );
        setSelectedPhoto(updatedPhoto);
    };

    // Handlers for drag and drop
    const handleFilesDropped = (files: FileList) => {
        setIsDragging(false);
        handleFiles(files);
        openUploadModal();
    };

    // Setup for photo tag editing
    const handleOpenTagEditor = (photo: Photo) => {
        setPhotoToTag(photo);
        openPhotoTagModal();
    };

    // Handle sharing a photo
    const handleSharePhoto = (url: string) => {
        setShareUrl(url);
        openShareModal();
    };

    // Handle creating a new tag
    const handleNewTag = () => {
        setEditingTag(null);
        closePhotoTagModal();
        openTagModal();
    };

    // Handle editing a tag
    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag);
        openTagModal();
    };

    // First in the main component, add a function to remove an image:
    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        newImages.splice(index, 1);
        setUploadedImages(newImages);

        // Adjust current index if needed
        if (index <= currentImageIndex && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const handleUploadClick = useCallback(() => {
        // TODO: Implement upload functionality
        console.log('Upload clicked');
    }, []);

    const handlePhotoClick = useCallback((photo: Photo) => {
        setSelectedPhoto(photo);
        // Reset any active filters when opening photo details
        setIsSearchOpen(false);
        setSearchTerm('');
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedPhoto(null);
    }, []);

    const handleShareClick = useCallback(
        (url: string) => {
            setShareUrl(url);
            openShareModal();
        },
        [openShareModal],
    );

    return (
        <>
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <AppLayout
            albums={albums}
            tags={tags}
            photos={photos}
            selectedAlbum={selectedAlbum}
            selectedTag={selectedTag}
            isMenuOpen={isMenuOpen}
            isSearchOpen={isSearchOpen}
            searchTerm={searchTerm}
            onAlbumSelect={setSelectedAlbum}
            onTagSelect={setSelectedTag}
            onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
            onSearchToggle={() => setIsSearchOpen(!isSearchOpen)}
            onSearchChange={handleSearch}
            onSearchClose={() => {
                setIsSearchOpen(false);
                handleSearch('');
            }}
            onHomeClick={() => {
                setSelectedAlbum('all');
                setSelectedTag(null);
                handleSearch('');
            }}
            onAddPhoto={openUploadModal}
            onCreateAlbum={openAlbumModal}
            onCreateTag={handleNewTag}
            onEditTag={handleEditTag}
            onDeleteAlbum={handleAlbumDelete}
            onDeleteTag={handleTagDelete}
        >
            <DropZone
                onFilesDropped={(files) => {
                    openUploadModal();
                    handleFiles(files);
                }}
                className="container mx-auto px-4 py-8"
            >
                <PhotoGrid photos={filteredPhotos} tags={tags} onPhotoSelect={handlePhotoClick} />
            </DropZone>

            {selectedPhoto && (
                <div className="z-[100]">
                    <PhotoDetailModal
                        photo={selectedPhoto}
                        onClose={handleCloseModal}
                        onNavigate={navigatePhoto}
                        albums={albums}
                        tags={tags}
                        onAlbumChange={handlePhotoAlbumChange}
                        onTagsEdit={handleOpenTagEditor}
                        onShare={handleShareClick}
                        onPhotoUpdate={handlePhotoUpdate}
                        isTagModalOpen={modalState.isPhotoTagModalOpen}
                        closeTagModal={closePhotoTagModal}
                        isShareModalOpen={modalState.isShareModalOpen}
                        closeShareModal={closeShareModal}
                    />
                </div>
            )}

            {modalState.isPhotoTagModalOpen && photoToTag && (
                <div className="z-[100]">
                    <PhotoTagModal
                        photo={photoToTag}
                        tags={tags}
                        onClose={closePhotoTagModal}
                        onUpdateTags={handlePhotoTagUpdate}
                        onCreateNewTag={handleNewTag}
                    />
                </div>
            )}

            {modalState.isTagModalOpen && (
                <div className="z-[100]">
                    <TagManagementModal
                        onClose={closeTagModal}
                        onSave={handleTagSave}
                        onDelete={handleTagDelete}
                        editingTag={editingTag}
                    />
                </div>
            )}

            {modalState.isAlbumModalOpen && (
                <div className="z-[100]">
                    <AlbumCreationModal onClose={closeAlbumModal} onSave={handleAlbumCreate} />
                </div>
            )}

            {modalState.isShareModalOpen && (
                <div className="z-[100]">
                    <ShareModal url={shareUrl} onClose={closeShareModal} />
                </div>
            )}

            {modalState.isUploadModalOpen && (
                <div className="z-[100]">
                    <UploadPhotoModal
                        onClose={closeUploadModal}
                        onUpload={addNewPhotos}
                        onAddFiles={openFileDialog}
                        onEditTags={handleOpenTagEditor}
                        uploadedImages={uploadedImages}
                        albums={albums}
                        tags={tags}
                        onRemoveImage={removeImage}
                        onCreateAlbum={openAlbumModal}
                        photoMetadata={photoMetadata}
                        updatePhotoMetadata={(index, field, value) => {
                            if (field === 'tags' && Array.isArray(value)) {
                                updatePhotoTags(index, value);
                            } else {
                                setPhotoMetadata((prev) => {
                                    const updated = [...prev];
                                    if (!updated[index]) {
                                        updated[index] = { title: '', description: '', tags: [] };
                                    }
                                    updated[index] = {
                                        ...updated[index],
                                        [field]: value,
                                    };
                                    return updated;
                                });
                            }
                        }}
                    />
                </div>
            )}
        </AppLayout>
        </>
    );
}
