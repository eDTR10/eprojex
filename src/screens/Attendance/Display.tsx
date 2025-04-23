import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from './../../plugin/axios';
import AI from './../../assets/ai/juan.mp4'
import Sas1 from './../../assets/ai/sas1.png'
import Sas2 from './../../assets/ai/sas2.png'
import Sas3 from './../../assets/ai/sas3.png'
interface AttendanceData {
    id: number;
    name: string;
    designation: string;
    lgu_agency: string;
    created_date: string;
}

function Display() {
    const [currentAttendee, setCurrentAttendee] = useState<AttendanceData | null>(null);
    const [queue, setQueue] = useState<AttendanceData[]>([]);
    const [allAttendees, setAllAttendees] = useState<AttendanceData[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Load already shown attendee IDs from localStorage
    const getShownAttendees = useCallback((): number[] => {
        const shownAttendeesString = localStorage.getItem('shownAttendees');
        return shownAttendeesString ? JSON.parse(shownAttendeesString) : [];
    }, []);

    // Save already shown attendee IDs to localStorage
    const saveShownAttendee = useCallback((id: number) => {
        const shownAttendees = getShownAttendees();
        if (!shownAttendees.includes(id)) {
            const updatedShownAttendees = [...shownAttendees, id];
            localStorage.setItem('shownAttendees', JSON.stringify(updatedShownAttendees));
        }
    }, [getShownAttendees]);

    // Process the next attendee in the queue
    const processNextAttendee = useCallback(() => {
        // Clear any existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (queue.length > 0) {
            const nextAttendee = queue[0];
            setCurrentAttendee(nextAttendee);
            saveShownAttendee(nextAttendee.id);
            setQueue(prevQueue => prevQueue.slice(1));

            // Set timer for next attendee
            timerRef.current = setTimeout(() => {
                setCurrentAttendee(null);
                processNextAttendee();
            },1000);
        } else {
            setCurrentAttendee(null);
        }
    }, [queue, saveShownAttendee]);


    useEffect(() => {
        // Only set up reload interval if there's no current attendee
        console.log('Current Attendee:', currentAttendee==null ? 'No attendee' : currentAttendee.name);
        const reloadInterval = setInterval(() => {
            window.location.reload();
        }, 10000);
        if (!currentAttendee==null) {
            reloadInterval

            // Cleanup interval when component unmounts or when currentAttendee changes
            
        }else{
            return () => clearInterval(reloadInterval);
        }
    }, [currentAttendee]); // Add currentAttendee as dependency

    const fetchAttendance = useCallback(async () => {
        try {
            const response = await axios.get('/qr/all/', {
                headers: {
                    Authorization: `Token 8622fe22a3814cbc47e1ec14555fdc8cb529ee79`,
                }
            });
            const data: AttendanceData[] = response.data;

            // Sort by created_date in ascending order (oldest first for the side panel)
            const sortedDataForDisplay = data.sort((a, b) => 
                new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
            );
            setAllAttendees(sortedDataForDisplay);

            // Sort by created_date in ascending order (oldest first for the queue)
            const chronologicalData = [...data].sort((a, b) => 
                new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
            );

            // Get entries that haven't been shown yet
            const shownAttendees = getShownAttendees();
            const unshownAttendees = chronologicalData.filter(entry => !shownAttendees.includes(entry.id));
            
            // Update the queue with unshown attendees only if we're not currently showing anyone
            if (unshownAttendees.length > 0) {
                // If no attendee is currently displayed, or if there's no active timer,
                // update the queue and process the next attendee
                if (!currentAttendee) {
                    setQueue(prevQueue => {
                        // Add only new attendees that aren't already in the queue
                        const currentQueueIds = prevQueue.map(a => a.id);
                        const newAttendees = unshownAttendees.filter(a => !currentQueueIds.includes(a.id));
                        return [...prevQueue, ...newAttendees];
                    });
                } else {
                    // If an attendee is displayed, just update the queue with new attendees
                    setQueue(prevQueue => {
                        const currentQueueIds = [...prevQueue.map(a => a.id), currentAttendee.id];
                        const newAttendees = unshownAttendees.filter(a => !currentQueueIds.includes(a.id));
                        return [...prevQueue, ...newAttendees];
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    }, [currentAttendee, getShownAttendees]);

    useEffect(() => {
        fetchAttendance();
        // Poll the API every 5000 milliseconds (5 seconds)
        const fetchInterval = setInterval(fetchAttendance, 5000);
        
        return () => {
            clearInterval(fetchInterval);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [fetchAttendance]);

    // Start processing queue when queue changes and no active display
    useEffect(() => {
        if (queue.length > 0 && !currentAttendee && !timerRef.current) {
            processNextAttendee();
        }
    }, [queue, currentAttendee, processNextAttendee]);

    // Reset stored attendees function (for development purposes)
    const resetStoredAttendees = () => {
        localStorage.removeItem('shownAttendees');
        alert('Shown attendees reset. Page will refresh.');
        window.location.reload();
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden relative bg-[#e8f1ff]">
            {/* Main Display */}
            <img src={Sas1} className=' fixed z-40 left-0 bottom-0 h-[300px] object-contain pointer-events-none' alt="" />
            <img src={Sas2} className=' fixed z-40 right-0 bottom-0 h-[600px] object-contain pointer-events-none' alt="" />
         
<img src={Sas3} className=' fixed h-[800px] object-contain pointer-events-none translate-x-[50vw] translate-y-[10vh]' alt="" />
         
            

            <video src={AI} autoPlay loop className=' translate-y-[10vh] h-[100vh] object-contain absolute   '>
                <source src={AI}  type="video/mp4" />
                Your browser does not support the video tag.
                <p className="text-center text-white">Your browser does not support the video tag.</p>
            </video>
            <div className="flex-1 p-8 z-10 w-[0vw] items-center justify-center flex flex-col translate-y-[-10vh] translate-x-[10vw] animate__animated animate__fadeIn"> 
                <div className="bg-white/30 border boder-border back rounded-xl  p-8 w-[50vw] mx-auto ">
                    {currentAttendee ? (
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl text-[#282828] mb-2">
                                Welcome to DICT Region 10 <br /> <span className=' font-bold'>
                                   LOCAL CHIEF INFORMATION OFFICER (CIO) CONFERENCE! </span> 
                            </h1>
                            <div className="animate-fade-in">
                                <h2 className="text-5xl font-bold text-[#0036c6] mb-4">
                                    {currentAttendee.name}
                                </h2>
                                <p className="text-xl text-gray-600 mb-2">
                                <span className=' font-bold'>{currentAttendee.lgu_agency}</span>  - {currentAttendee.designation}
                                </p>
                               
                            </div>
                        </div>
                    ) : (
                        <div className="text-center font-bold text-4xl text-[#0036c6]">
                            Have fun at LOCAL CHIEF INFORMATION OFFICER (CIO) CONFERENCE! <br />
                            <span className="text-sm text-gray-600">Waiting for the next attendee...</span>
                        </div>
                    )}
                </div>

                {/* Queue Preview */}
                {/* <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold text-[#0036c6] mb-4">Next in Queue</h3>
                    <div className="flex justify-center gap-4">
                        {queue.slice(0, 3).map((attendee) => (
                            <div 
                                key={attendee.id}
                                className="bg-white rounded-lg shadow-md p-4 max-w-xs"
                            >
                                <p className="font-semibold text-[#0036c6]">{attendee.name}</p>
                                <p className="text-sm text-gray-500">{attendee.lgu_agency}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(attendee.created_date).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                        {queue.length === 0 && (
                            <div className="text-gray-400">No attendees in queue</div>
                        )}
                    </div>
                </div> */}

                {/* Development controls - Remove in production */}
                {/* <div className="mt-8 text-center">
                    <button 
                        onClick={resetStoredAttendees}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    >
                        Reset Shown Attendees
                    </button>
                </div> */}
            </div>

            {/* Side List */}
            {/* <div className="w-96 bg-white shadow-lg p-6 overflow-auto">
                <h2 className="text-xl font-bold text-[#0036c6] mb-4">Recent Attendees</h2>
                <div className="space-y-3">
                    {allAttendees.map((attendee) => (
                        <div 
                            key={attendee.id}
                            className={`p-3 rounded-lg transition-all ${
                                currentAttendee?.id === attendee.id 
                                    ? 'bg-[#0036c6] text-white' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                            <p className="font-medium">{attendee.name}</p>
                            <p className="text-sm opacity-75">{attendee.lgu_agency}</p>
                            <p className="text-xs opacity-50">
                                {new Date(attendee.created_date).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
}

export default Display;