import React, { useState } from 'react';
import { Album, Tag, Photo } from '@/app/types';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export interface AppLayoutProps {
    children: React.ReactNode;
    albums: Album[];
    tags: Tag[];
    photos: Photo[];
    selectedAlbum: string;
    selectedTag: string | null;
    isMenuOpen: boolean;
    isSearchOpen: boolean;
    searchTerm: string;
    onAlbumSelect: (albumId: string) => void;
    onTagSelect: (tagId: string | null) => void;
    onMenuToggle: () => void;
    onSearchToggle: () => void;
    onSearchChange: (value: string) => void;
    onSearchClose: () => void;
    onHomeClick: () => void;
    onAddPhoto: () => void;
    onCreateAlbum: () => void;
    onCreateTag: () => void;
    onEditTag: (tag: Tag) => void;
    onDeleteAlbum: (albumId: string) => void;
    onDeleteTag: (tagId: string) => void;
}

/**
 * Main layout component for the photo gallery application
 * Includes sidebar, top bar, and main content area
 *
 * @param children - Main content to render
 * @param albums - Array of albums
 * @param tags - Array of tags
 * @param photos - Array of photos
 * @param selectedAlbum - Currently selected album ID
 * @param selectedTag - Currently selected tag ID
 * @param onAlbumSelect - Handler for selecting an album
 * @param onTagSelect - Handler for selecting a tag
 * @param onCreateAlbum - Handler for creating an album
 * @param onCreateTag - Handler for creating a tag
 * @param onEditTag - Handler for editing a tag
 * @param onDeleteAlbum - Handler for deleting an album
 * @param onDeleteTag - Handler for deleting a tag
 * @param onAddPhoto - Handler for adding a photo
 */
const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    albums,
    tags,
    photos,
    selectedAlbum,
    selectedTag,
    onAlbumSelect,
    onTagSelect,
    onCreateAlbum,
    onCreateTag,
    onEditTag,
    onDeleteAlbum,
    onDeleteTag,
    onAddPhoto,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const onMenuToggle = () => setIsMenuOpen(!isMenuOpen);
    const onHomeClick = () => {
        onAlbumSelect('all');
        onTagSelect(null);
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Global styles for full background coverage */}
            <style jsx global>{`
                body {
                    background-color: #1d1d1f;
                    margin: 0;
                    overflow-x: hidden;
                    min-height: 100vh;
                }

                html {
                    background-color: #1d1d1f;
                    overflow-x: hidden;
                }
            `}</style>

            {/* TopBar component */}
            <TopBar onMenuToggle={onMenuToggle} onHomeClick={onHomeClick} onAddPhoto={onAddPhoto} />

            {/* Sidebar component */}
            <Sidebar
                albums={albums}
                tags={tags}
                photos={photos}
                selectedAlbum={selectedAlbum}
                selectedTag={selectedTag}
                onAlbumSelect={onAlbumSelect}
                onTagSelect={onTagSelect}
                onCreateAlbum={onCreateAlbum}
                onCreateTag={onCreateTag}
                onEditTag={onEditTag}
                onDeleteAlbum={onDeleteAlbum}
                onDeleteTag={onDeleteTag}
                isOpen={isMenuOpen}
            />

            {/* Overlay for mobile menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={onMenuToggle} />
            )}

            {/* Main content */}
            <main
                className={`transition-all duration-300 ${isMenuOpen ? 'ml-0' : ''} md:ml-60 pt-14`}
            >
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
