import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import favicon from "../../resources/load.gif";

/**
 * LoadingOverlay displays a fullscreen loading animation using a GIF.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Whether to show or hide the loading overlay.
 * @returns {JSX.Element|null} A fullscreen loading overlay or null if hidden.
 *
 * @example
 * <LoadingOverlay show={true} />
 */
export default function LoadingOverlay({ show }) {
    if (!show) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                userSelect: 'none',
            }}
        >
            <img
                src={favicon}
                alt="Loading animation"
                style={{
                    width: '130px', 
                    height: '130px',
                    pointerEvents: 'none', 
                    userSelect: 'none',
                    draggable: false,
                }}
                onDragStart={(e) => e.preventDefault()} 
            />
        </Box>
    );
}

LoadingOverlay.propTypes = {
    /**
     * Whether to show or hide the loading overlay.
     */
    show: PropTypes.bool.isRequired,

    /**
     * The path to the loading GIF file.
     */
    gifPath: PropTypes.string,
};
