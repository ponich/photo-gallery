'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Photo, Tag, Album } from './types';
import { mockPhotos, mockTags, mockAlbums } from './mockData';

// Components
import AppLayout from './components/layout/AppLayout';
import PhotoGrid from './components/ui/PhotoGrid';
import PhotoDetailModal from './components/modals/PhotoDetailModal';
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
        filteredPhotos,
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

    // Function to navigate to previous/next photo
    const navigatePhoto = (direction: 'prev' | 'next') => {
        if (!selectedPhoto) return;

        // Find current photo index
        const currentIndex = filteredPhotos.findIndex((photo) => photo.id === selectedPhoto.id);

        // Calculate new index
        let newIndex;
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
        } else {
            newIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
        }

        // Set new selected photo
        setSelectedPhoto(filteredPhotos[newIndex]);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedPhoto) return;

            if (e.key === 'ArrowLeft') {
                navigatePhoto('prev');
            } else if (e.key === 'ArrowRight') {
                navigatePhoto('next');
            } else if (e.key === 'Escape') {
                setSelectedPhoto(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, filteredPhotos]);

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
    };

    // Handler for updating a photo's details
    const handlePhotoUpdate = (updatedPhoto: Photo) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((p) => (p.id === updatedPhoto.id ? updatedPhoto : p)),
        );

        // Update the selected photo state as well
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

    return (
        <DropZone onFilesDropped={handleFilesDropped} className="min-h-screen">
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
                onSearchToggle={() => setIsSearchOpen(true)}
                onSearchChange={setSearchTerm}
                onSearchClose={() => setIsSearchOpen(false)}
                onHomeClick={() => {
                    setSelectedAlbum('all');
                    setSelectedTag(null);
                    setSelectedPhoto(null);
                }}
                onAddPhoto={openUploadModal}
                onCreateAlbum={openAlbumModal}
                onCreateTag={() => {
                    setEditingTag(null);
                    openTagModal();
                }}
                onEditTag={handleEditTag}
                onDeleteAlbum={handleAlbumDelete}
                onDeleteTag={handleTagDelete}
            >
                <div className="p-6">
                    <PhotoGrid
                        photos={filteredPhotos}
                        tags={tags}
                        onPhotoSelect={setSelectedPhoto}
                    />
                </div>
            </AppLayout>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple
            />

            {/* Modals */}
            {selectedPhoto && (
                <div className="z-[100]">
                    <PhotoDetailModal
                        photo={selectedPhoto}
                        onClose={() => setSelectedPhoto(null)}
                        onNavigate={navigatePhoto}
                        albums={albums}
                        tags={tags}
                        onAlbumChange={handlePhotoAlbumChange}
                        onTagsEdit={handleOpenTagEditor}
                        onShare={handleSharePhoto}
                        onPhotoUpdate={handlePhotoUpdate}
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
                            // If the field is 'tags', we can directly use updatePhotoTags
                            if (field === 'tags' && Array.isArray(value)) {
                                updatePhotoTags(index, value);
                            } else {
                                // For other fields, create a new object with the updated field
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
        </DropZone>
    );
}
