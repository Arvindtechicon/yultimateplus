'use client';

import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { venues, events } from '@/lib/mockData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation, Pin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 37.0902,
  lng: -95.7129,
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        // Styles for light mode - can be customized
        {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
    ]
}

const darkMapOptions = {
    ...mapOptions,
    styles: [
        // Styles for dark mode - from https://snazzymaps.com/style/2/midnight-commander
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#000000"
                },
                {
                    "lightness": 13
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#144b53"
                },
                {
                    "lightness": 14
                },
                {
                    "weight": 1.4
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#08304b"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0c4152"
                },
                {
                    "lightness": 5
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b434f"
                },
                {
                    "lightness": 25
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#0b3d51"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#146474"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#021019"
                }
            ]
        }
    ]
};

function MapComponent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [selectedVenue, setSelectedVenue] =
    useState<(typeof venues)[0] | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(4);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Detect theme for map styles
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setCurrentTheme(theme);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const newTheme = (mutation.target as HTMLElement).classList.contains('dark') ? 'dark' : 'light';
                setCurrentTheme(newTheme);
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (venueId) {
      const venue = venues.find((v) => v.id === parseInt(venueId));
      if (venue) {
        handleVenueSelect(venue);
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

  const handleVenueSelect = (venue: (typeof venues)[0]) => {
    setSelectedVenue(venue);
    setMapCenter(venue.coordinates);
    setZoom(14);
    setDirections(null);
  };

  if (!isLoaded)
    return (
      <div className="p-8">
        <Skeleton className="h-[calc(100vh-10rem)] w-full" />
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-4rem)]">
      <motion.div 
        initial={{x: -100, opacity: 0}}
        animate={{x: 0, opacity: 1}}
        className="lg:col-span-1 space-y-4 overflow-y-auto p-4 bg-background/80 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold px-2">Events Venues</h2>
        {venues.map((venue, i) => (
          <motion.div
            key={venue.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1 * i}}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 glass-card hover:border-primary/60 ${
                selectedVenue?.id === venue.id
                  ? 'border-primary shadow-lg'
                  : ''
              }`}
              onClick={() => handleVenueSelect(venue)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pin className="w-5 h-5 text-primary" /> {venue.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{venue.location}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">
                    Events at this venue:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {events
                      .filter((e) => e.venueId === venue.id)
                      .map((e) => (
                        <li key={e.id}>{e.name}</li>
                      ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <div className="lg:col-span-2 h-full flex flex-col relative">
        <motion.div 
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <Card className="p-4 glass-card">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your starting location"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                disabled={!selectedVenue}
              />
              <Button
                onClick={handleGetDirections}
                disabled={!selectedVenue || !userLocation}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
            {!selectedVenue && (
              <p className="text-sm text-muted-foreground mt-2">
                Select a venue from the list to get directions.
              </p>
            )}
          </Card>
        </motion.div>
        <div className="flex-grow">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            options={currentTheme === 'dark' ? darkMapOptions : mapOptions}
          >
            {venues.map((venue) => (
              <Marker
                key={venue.id}
                position={venue.coordinates}
                onClick={() => handleVenueSelect(venue)}
              />
            ))}

            <AnimatePresence>
            {selectedVenue && (
              <InfoWindow
                position={selectedVenue.coordinates}
                onCloseClick={() => setSelectedVenue(null)}
              >
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
                  <h3 className="font-bold text-gray-800">{selectedVenue.name}</h3>
                  <p className='text-gray-600'>{selectedVenue.location}</p>
                </motion.div>
              </InfoWindow>
            )}
            </AnimatePresence>
            {directions && <DirectionsRenderer directions={directions} options={{
                polylineOptions: {
                    strokeColor: '#8A2BE2',
                    strokeWeight: 5,
                }
            }}/>}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default MapComponent;
