"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { venues, events } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation, Pin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.0902,
  lng: -95.7129,
};

function MapPage() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedVenue, setSelectedVenue] = useState<typeof venues[0] | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [mapCenter, setMapCenter] = useState(center);
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    if (venueId) {
      const venue = venues.find(v => v.id === parseInt(venueId));
      if (venue) {
        setSelectedVenue(venue);
        setMapCenter(venue.coordinates);
        setZoom(14);
      }
    }
  }, [venueId]);

  const handleGetDirections = () => {
    if (!selectedVenue || !userLocation) return;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: selectedVenue.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
          alert('Could not get directions. Please check your start location.');
        }
      }
    );
  };

  const handleVenueSelect = (venue: typeof venues[0]) => {
    setSelectedVenue(venue);
    setMapCenter(venue.coordinates);
    setZoom(14);
    setDirections(null);
  }

  if (!isLoaded) return <div className='container mx-auto py-10 animate-fade-in-up'><Skeleton className='h-[80vh] w-full' /></div>;
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
        <div className="container mx-auto py-10 flex items-center justify-center h-[80vh] animate-fade-in-up">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle>Google Maps API Key Missing</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Please add your Google Maps API Key to continue. Create a `.env.local` file in the root of your project and add the following:</p>
                    <pre className="bg-muted p-2 rounded-md my-4 text-sm dark:bg-background">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=Your_API_Key_Here</pre>
                    <p>You will need to restart your development server after adding the key.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-10 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[85vh]">
        <div className="md:col-span-1 space-y-4 overflow-y-auto pr-4">
          <h2 className="text-2xl font-bold">Events Venues</h2>
          {venues.map(venue => (
            <Card key={venue.id} className={`cursor-pointer hover:shadow-md transition-shadow duration-300 ${selectedVenue?.id === venue.id ? 'border-primary shadow-lg' : ''}`} onClick={() => handleVenueSelect(venue)}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Pin className='w-5 h-5 text-primary' /> {venue.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{venue.location}</p>
                 <div className='mt-4'>
                    <h4 className='font-semibold text-sm mb-2'>Events at this venue:</h4>
                    <ul className='list-disc list-inside text-sm text-muted-foreground space-y-1'>
                        {events.filter(e => e.venueId === venue.id).map(e => <li key={e.id}>{e.name}</li>)}
                    </ul>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="md:col-span-2 h-full flex flex-col gap-4">
            <Card className="p-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter your starting location" 
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        disabled={!selectedVenue}
                    />
                    <Button onClick={handleGetDirections} disabled={!selectedVenue || !userLocation}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                    </Button>
                </div>
                {!selectedVenue && <p className='text-sm text-muted-foreground mt-2'>Select a venue to get directions.</p>}
            </Card>
            <div className='flex-grow rounded-lg overflow-hidden border shadow-md'>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={zoom}
                >
                    {venues.map(venue => (
                    <Marker 
                        key={venue.id} 
                        position={venue.coordinates} 
                        onClick={() => handleVenueSelect(venue)}
                    />
                    ))}

                    {selectedVenue && (
                    <InfoWindow
                        position={selectedVenue.coordinates}
                        onCloseClick={() => setSelectedVenue(null)}
                    >
                        <div>
                            <h3 className='font-bold'>{selectedVenue.name}</h3>
                            <p>{selectedVenue.location}</p>
                        </div>
                    </InfoWindow>
                    )}
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPageWrapper() {
  return (
    <Suspense fallback={<div className='container mx-auto py-10'><Skeleton className='h-[80vh] w-full' /></div>}>
      <MapPage />
    </Suspense>
  )
}
