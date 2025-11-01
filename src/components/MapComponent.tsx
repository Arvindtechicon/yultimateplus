
'use client';

import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { venues, coachingCenters, mockCommunities, mockSessions, type Community } from '@/lib/mockData';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation, Pin, Users, BookOpen } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';


type PointOfInterest = {
    id: string;
    name: string;
    type: 'venue' | 'center' | 'community';
    coordinates: { lat: number, lng: number };
    description: string;
    children?: number;
    sessions?: number;
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 12.2958,
  lng: 76.6394,
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

const getIconUrl = (type: PointOfInterest['type']) => {
    const color = {
        venue: 'FF6B6B', // red
        center: '4ECDC4', // teal
        community: '45B7D1' // blue
    }[type];
    return `https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`;
}

function MapComponent() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const { events } = useApp();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [selectedPoi, setSelectedPoi] =
    useState<PointOfInterest | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(12);
  const [currentTheme, setCurrentTheme] = useState('light');

  const pointsOfInterest: PointOfInterest[] = [
    ...venues.map(v => ({ id: `v-${v.id}`, name: v.name, type: 'venue' as const, coordinates: v.coordinates, description: v.location })),
    ...coachingCenters.map(c => ({ id: `c-${c.id}`, name: c.name, type: 'center' as const, coordinates: c.coordinates, description: c.specialty })),
    ...mockCommunities.map(c => ({ id: `com-${c.name}`, name: c.name, type: 'community' as const, coordinates: { lat: c.lat, lng: c.lng }, description: `${c.children} children`, children: c.children, sessions: mockSessions.filter(s => s.community === c.name).length }))
  ]

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
      const venue = pointsOfInterest.find((v) => v.id === `v-${venueId}`);
      if (venue) {
        handlePoiSelect(venue);
      }
    }
  }, [venueId]);

  const handleGetDirections = () => {
    if (!selectedPoi || !userLocation) return;
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: selectedPoi.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions. Status: ${status}`);
          alert('Could not get directions. Please check your start location.');
        }
      }
    );
  };

  const handlePoiSelect = (poi: PointOfInterest) => {
    setSelectedPoi(poi);
    setMapCenter(poi.coordinates);
    setZoom(14);
    setDirections(null);
  };

  const getIconForPoi = (type: PointOfInterest['type']) => {
    switch (type) {
      case 'venue': return <Pin className="w-5 h-5 text-red-500" />;
      case 'center': return <BookOpen className="w-5 h-5 text-teal-500" />;
      case 'community': return <Users className="w-5 h-5 text-blue-500" />;
      default: return <Pin className="w-5 h-5 text-primary" />;
    }
  }

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
        <h2 className="text-2xl font-bold px-2">Points of Interest</h2>
        {pointsOfInterest.map((poi, i) => (
          <motion.div
            key={poi.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.05 * i}}
          >
            <Card
              className={cn(`cursor-pointer transition-all duration-300 glass-card hover:border-primary/60`,
                selectedPoi?.id === poi.id ? 'border-primary shadow-lg' : ''
              )}
              onClick={() => handlePoiSelect(poi)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {getIconForPoi(poi.type)}
                  {poi.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{poi.description}</p>
                {poi.type === 'venue' && (
                    <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Events at this venue:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {events.filter(e => e.venueId === parseInt(poi.id.split('-')[1])).map(e => <li key={e.id}>{e.name}</li>)}
                        </ul>
                    </div>
                )}
                 {poi.type === 'community' && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        {poi.sessions} active sessions
                    </div>
                 )}
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
                disabled={!selectedPoi}
              />
              <Button
                onClick={handleGetDirections}
                disabled={!selectedPoi || !userLocation}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>
            {!selectedPoi && (
              <p className="text-sm text-muted-foreground mt-2">
                Select a point of interest from the list to get directions.
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
            {pointsOfInterest.map((poi) => (
              <Marker
                key={poi.id}
                position={poi.coordinates}
                onClick={() => handlePoiSelect(poi)}
                icon={getIconUrl(poi.type)}
              />
            ))}

            <AnimatePresence>
            {selectedPoi && (
              <InfoWindow
                position={selectedPoi.coordinates}
                onCloseClick={() => setSelectedPoi(null)}
              >
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
                  <h3 className="font-bold text-gray-800">{selectedPoi.name}</h3>
                   <p className='text-gray-600 text-sm'>{selectedPoi.description}</p>
                   {selectedPoi.type === 'community' && <p className='text-gray-600 text-sm'>{selectedPoi.sessions} active sessions</p>}
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
