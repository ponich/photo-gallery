import { FC, useRef } from 'react';

interface ShareModalProps {
    url: string;
    onClose: () => void;
}

/**
 * Modal component for sharing a photo URL
 * Provides a copy-to-clipboard functionality
 */
const ShareModal: FC<ShareModalProps> = ({ url, onClose }) => {
    const shareInputRef = useRef<HTMLInputElement>(null);

    /**
     * Copies the provided text to clipboard
     * Automatically closes the modal after successful copy
     */
    const copyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                // Show success notification or change button state
                setTimeout(() => {
                    onClose();
                }, 1500);
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#2d2d2f] rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-100">Share Photo</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-4">
                        Copy the link below to share this photo:
                    </p>
                    <div className="flex">
                        <input
                            ref={shareInputRef}
                            type="text"
                            value={url}
                            readOnly
                            className="w-full bg-[#1d1d1f] rounded-l-lg px-4 py-2 focus:outline-none text-gray-200"
                        />

                        <button
                            onClick={() => copyToClipboard(url)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-r-lg"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
