import React, { useState, useEffect, useCallback } from 'react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import Swal from 'sweetalert2';
import axios from './../../plugin/axios';

const AttendanceMainContainer = () => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [scanning, setScanning] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);

    // Request camera permissions first
    const requestCameraPermission = useCallback(async () => {
        try {
            if (!navigator?.mediaDevices?.getUserMedia) {
                showToast('error', 'Camera API not supported in this browser');
                return;
            }

            // First request camera access explicitly
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment' // Prefer rear camera
                }
            });

            // Stop the test stream
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);

            // Now enumerate devices after permission is granted
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            if (videoDevices.length === 0) {
                showToast('error', 'No cameras found');
                return;
            }

            setCameras(videoDevices);

            // Prefer rear camera if available
            const rearCamera = videoDevices.find(device => 
                device.label.toLowerCase().includes('back') || 
                device.label.toLowerCase().includes('rear')
            );
            
            setSelectedCamera(rearCamera?.deviceId || videoDevices[0].deviceId);
            setScanning(true);

        } catch (error) {
            console.error('Camera permission error:', error);
            setHasPermission(false);
            showToast('error', 'Please allow camera access to use the scanner');
        }
    }, []);

    useEffect(() => {
        requestCameraPermission();
    }, [requestCameraPermission]);

    const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCamera(e.target.value);
    };

    const handleScan = (detectedCodes: IDetectedBarcode[]) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const firstCode = detectedCodes[0];
            setScanning(false);
            setScannedData(firstCode.rawValue);
            setShowDialog(true);
        }
    };

    const handleConfirm = async () => {
        if (scannedData) {
            try {
                const response = await axios.post('/qr/all/', scannedData, {
                    headers: {
                        Authorization: `Token 8622fe22a3814cbc47e1ec14555fdc8cb529ee79`,
                    }
                });
    
                // Close the dialog first
                setShowDialog(false);
                setScanning(true);
    
                // Then show the success message
                // await Swal.fire({
                //     icon: 'success',
                //     title: 'Success!',
                //     text: `Attendance submitted successfully! Thank you ${response.data.name}`,
                //     showConfirmButton: true,
                //     confirmButtonColor: '#22c55e', // Green color
                //     timer: 5000,
                //     timerProgressBar: true,
                // });
    
            } catch (error) {
                console.error('Submission error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to submit attendance',
                    showConfirmButton: true,
                    confirmButtonColor: '#ef4444', // Red color
                });
            }
        }
    };
    const handleCancel = () => {
        setShowDialog(false);
        setScanning(true);
    };

    const formatDisplayData = (data: string) => {
        try {
            const parsed = JSON.parse(data);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return data;
        }
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

    return (
        <div className="w-full max-w-3xl mx-auto p-4 text-[#0036c6]">
            <h1 className="text-2xl font-bold flex justify-center mb-6 text-[#0036c6]">
                Attendance QR Scanner
            </h1>

            {hasPermission === false && (
                <div className="bg-[#0036c6]/10 border-l-4 border-[#0036c6] text-[#0036c6] p-4 mb-4 rounded-r">
                    <p className="font-bold">Camera Access Required</p>
                    <p className="mb-2">Please allow camera access to use the QR scanner.</p>
                    <button
                        onClick={() => {
                            setHasPermission(null);
                            requestCameraPermission();
                        }}
                        className="bg-[#0036c6] text-white px-4 py-2 rounded hover:bg-[#0036c6]/90 transition-colors"
                    >
                        Grant Camera Access
                    </button>
                </div>
            )}

            {hasPermission === true && (
                <>
                    <div className="bg-[#0036c6]/5 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <label className="font-bold text-[#0036c6]" htmlFor="camera-select">
                                Camera:
                            </label>
                            <select
                                id="camera-select"
                                value={selectedCamera}
                                onChange={handleCameraChange}
                                disabled={scanning}
                                className="p-2 rounded border border-[#0036c6]/20 w-full sm:w-auto focus:border-[#0036c6] focus:ring-1 focus:ring-[#0036c6] outline-none"
                            >
                                {cameras.map((camera) => (
                                    <option key={camera.deviceId} value={camera.deviceId}>
                                        {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={toggleScanning}
                            className={`px-6 py-2 rounded font-bold text-white w-full sm:w-auto transition-colors
                                ${scanning 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-[#0036c6] hover:bg-[#0036c6]/90'}`}
                        >
                            {scanning ? 'Stop Scanning' : 'Start Scanning'}
                        </button>
                    </div>

                    {scanning && selectedCamera && (
                        <div className="w-full aspect-square max-h-[80vh] rounded-lg overflow-hidden border-2 border-[#0036c6]/20">
                            <Scanner
                                onScan={handleScan}
                                onError={(error) => {
                                    console.error('Scan error:', error);
                                    showToast('error', 'Scanner error occurred');
                                }}
                                constraints={{
                                    deviceId: selectedCamera,
                                    facingMode: 'environment',
                                    aspectRatio: 1
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {hasPermission === null && (
                <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0036c6] mx-auto mb-4"></div>
                    <p className="text-[#0036c6]">Requesting camera access...</p>
                </div>
            )}

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent className="border border-[#0036c6]/20">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#0036c6]">QR Code Detected</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <div className="bg-[#0036c6]/5 p-4 rounded-lg overflow-auto max-h-[200px]">
                                <pre className="text-sm whitespace-pre-wrap text-[#0036c6]">
                                    {scannedData && formatDisplayData(scannedData)}
                                </pre>
                            </div>
                            <p className="text-[#0036c6]">Submit this data for attendance?</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            onClick={handleCancel}
                            className="bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirm}
                            className="bg-[#0036c6] text-white hover:bg-[#0036c6]/90 transition-colors"
                        >
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AttendanceMainContainer;