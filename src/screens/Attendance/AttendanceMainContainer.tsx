import React, { useState, useEffect } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import Swal from 'sweetalert2';
import { submitQrAttendance } from '../../services/attendance';

const AttendanceMainContainer = () => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [scanning, setScanning] = useState<boolean>(false);

    // Load available cameras on component mount
    useEffect(() => {
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameras(videoDevices);

                // Select the first camera by default if available
                if (videoDevices.length > 0) {
                    setSelectedCamera(videoDevices[0].deviceId);
                }
            } catch (error) {
                console.error('Error getting cameras:', error);
                showToast('error', 'Failed to access cameras');
            }
        };

        getCameras();
    }, []);

    const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCamera(e.target.value);
    };

    const handleScan = (detectedCodes: IDetectedBarcode[]) => {
        // Check if any codes were detected
        if (detectedCodes && detectedCodes.length > 0) {
            // Get the first detected code
            const firstCode = detectedCodes[0];

            // Pause scanning to prevent multiple scans
            setScanning(false);

            // Get the QR code data
            const qrData = firstCode.rawValue;

            // Show confirmation dialog with the scanned data
            showConfirmationDialog(qrData);
        }
    };

    const showConfirmationDialog = (qrData: string) => {
        let parsedData;

        // Try to parse as JSON for display
        try {
            parsedData = JSON.parse(qrData);
        } catch (e) {
            // If not valid JSON, use raw string
            parsedData = qrData;
        }

        // Format data for display
        const displayData = typeof parsedData === 'object'
            ? JSON.stringify(parsedData, null, 2)
            : parsedData;

        Swal.fire({
            title: 'QR Code Detected',
            html: `
                <div style="text-align: left; margin-bottom: 15px;">
                    <pre style="max-height: 200px; overflow-y: auto; background: #f5f5f5; padding: 10px; border-radius: 5px;">${displayData}</pre>
                </div>
                <p>Submit this data for attendance?</p>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                submitAttendance(qrData);
            } else {
                // Resume scanning if canceled
                setScanning(true);
            }
        });
    };

    const submitAttendance = async (qrData: string) => {
        try {
            // Try to parse JSON if it's a string
            let dataToSubmit;
            try {
                dataToSubmit = JSON.parse(qrData);
            } catch (e) {
                dataToSubmit = qrData;
            }

            // Send to the API
            const response = await submitQrAttendance(dataToSubmit);

            // Show success message
            showToast('success', 'Attendance submitted successfully!');

            // Log the response
            console.log('Submission response:', response);
        } catch (error) {
            console.error('Error submitting attendance:', error);
            showToast('error', 'Failed to submit attendance');
        } finally {
            // Resume scanning after a delay
            setTimeout(() => {
                setScanning(true);
            }, 3000);
        }
    };

    const handleScanError = (error: Error) => {
        console.error('QR Scan error:', error);
        showToast('error', 'Failed to scan QR code');
    };

    const showToast = (icon: 'success' | 'error' | 'warning' | 'info', title: string, text?: string) => {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon,
            title,
            text,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    };

    const toggleScanning = () => {
        setScanning(!scanning);
    };

    // Inline styles
    const styles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        controlsWrapper: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
        },
        selectorGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        label: {
            fontWeight: 'bold',
        },
        select: {
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
            minWidth: '200px',
        },
        button: {
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: scanning ? '#f44336' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
        },
        scannerContainer: {
            width: '100%',
            height: '400px',
            margin: '0 auto',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #ddd',
        },
    };

    return (
        <div style={styles.container}>
            <h1>Attendance QR Scanner</h1>

            <div style={styles.controlsWrapper}>
                <div style={styles.selectorGroup}>
                    <label style={styles.label} htmlFor="camera-select">Select Camera:</label>
                    <select
                        id="camera-select"
                        value={selectedCamera}
                        onChange={handleCameraChange}
                        disabled={scanning}
                        style={styles.select}
                    >
                        {cameras.length === 0 && (
                            <option value="">No cameras found</option>
                        )}

                        {cameras.map((camera) => (
                            <option key={camera.deviceId} value={camera.deviceId}>
                                {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    style={styles.button}
                    onClick={toggleScanning}
                >
                    {scanning ? 'Stop Scanning' : 'Start Scanning'}
                </button>
            </div>

            {scanning && selectedCamera && (
                <div style={styles.scannerContainer}>
                    <Scanner
                        onScan={handleScan}

                    />
                </div>
            )}
        </div>
    );
};

export default AttendanceMainContainer;