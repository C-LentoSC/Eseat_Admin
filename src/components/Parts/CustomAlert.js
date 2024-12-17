import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';

/**
 * CustomAlert displays an auto-hidden or manually closable alert.
 * The alert appears at the bottom-right corner of the screen.
 *
 * @param {Object} props - The component props.
 * @param {'success' | 'info' | 'warning' | 'error'} props.severity - The type of alert to display.
 * @param {string} props.message - The message to display in the alert.
 * @returns {JSX.Element|null} A Material UI Alert component or null if closed.
 *
 * @example
 * <CustomAlert severity="success" message="Operation completed successfully!" />
 * <CustomAlert severity="error" message="An error occurred." />
 */
export default function CustomAlert({ severity = 'info', message }) {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!open) return null;

    return (
        <Stack
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: '300px',
                zIndex: 9999,
            }}
        >
            <Alert
                severity={severity}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </Stack>
    );
}

CustomAlert.propTypes = {
    /**
     * The type of alert to display.
     * One of: 'success', 'info', 'warning', 'error'.
     */
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,

    /**
     * The message content to display inside the alert.
     */
    message: PropTypes.string.isRequired,
};
