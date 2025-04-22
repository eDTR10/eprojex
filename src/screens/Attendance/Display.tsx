import React, { useEffect, useState } from 'react';
import axios from './../../plugin/axios';

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

    const fetchAttendance = async () => {
        try {
            const response = await axios.get('/qr/all/', {
                headers: {
                    Authorization: `Token 8622fe22a3814cbc47e1ec14555fdc8cb529ee79`,
                }
            });
            const data: AttendanceData[] = response.data;

            // Sort by created_date in descending order (newest first)
            const sortedData = data.sort((a, b) => 
                new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
            );

            setAllAttendees(sortedData);

            // Get entries within the last 5 minutes
            const recentTime = new Date(Date.now() - 5 * 60 * 1000);
            const recentEntries = sortedData.filter(entry => 
                new Date(entry.created_date) > recentTime
            );

            if (recentEntries.length > 0) {
                // Rotate through recent entries
                if (!currentAttendee) {
                    setCurrentAttendee(recentEntries[0]);
                    setQueue(recentEntries.slice(1));
                } else {
                    const currentIndex = recentEntries.findIndex(entry => entry.id === currentAttendee.id);
                    const nextIndex = (currentIndex + 1) % recentEntries.length;
                    setCurrentAttendee(recentEntries[nextIndex]);
                    setQueue(recentEntries.filter((_, index) => index !== nextIndex));
                }
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    useEffect(() => {
        fetchAttendance();
        const interval = setInterval(fetchAttendance, 10000); // Fetch every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main Display */}
            <div className="flex-1 p-8">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
                    {currentAttendee ? (
                        <div className="text-center space-y-4">
                            <h1 className="text-3xl font-bold text-[#0036c6] mb-8">
                                Welcome to DICT Region 10!
                            </h1>
                            <div className="animate-fade-in">
                                <h2 className="text-4xl font-bold text-[#0036c6] mb-4">
                                    {currentAttendee.name}
                                </h2>
                                <p className="text-2xl text-gray-600 mb-2">
                                    {currentAttendee.designation}
                                </p>
                                <p className="text-xl text-gray-500">
                                    {currentAttendee.lgu_agency}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Waiting for attendees...
                        </div>
                    )}
                </div>

                {/* Queue Preview */}
                <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold text-[#0036c6] mb-4">Next in Queue</h3>
                    <div className="flex justify-center gap-4">
                        {queue.slice(0, 3).map((attendee) => (
                            <div 
                                key={attendee.id}
                                className="bg-white rounded-lg shadow-md p-4 max-w-xs"
                            >
                                <p className="font-semibold text-[#0036c6]">{attendee.name}</p>
                                <p className="text-sm text-gray-500">{attendee.lgu_agency}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Side List */}
            <div className="w-96 bg-white shadow-lg p-6 overflow-auto">
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
            </div>
        </div>
    );
}

export default Display;