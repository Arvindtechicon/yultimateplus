
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize, Upload, PlusCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { useAppData } from '@/context/EventContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';


export default function GalleryPage() {
    const { events, addImageToEvent, tempEventImages } = useAppData();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedEventForUpload, setSelectedEventForUpload] = useState<string | null>(null);

    const canUpload = user?.role === 'Admin' || user?.role === 'Organizer';
    
    const pastEvents = events.filter(e => new Date(e.date) < new Date());
    
    // Assign images to past events for a mock album structure.
    const albums = pastEvents.map((event) => {
        const existingImages = PlaceHolderImages.filter(img => img.eventId === event.id);
        const newImages = tempEventImages[event.id] || [];
      
        return {
          ...event,
          images: [...existingImages, ...newImages],
        };
    });


  const handleUpload = () => {
    if (!selectedEventForUpload) {
        toast({
            variant: "destructive",
            title: "No Event Selected",
            description: "Please select an event to upload the photo to.",
        });
        return;
    }
    const eventId = parseInt(selectedEventForUpload, 10);
    // In a real app, this would handle file uploads. Here we simulate it.
    const newImage: ImagePlaceholder = {
        id: `temp-${eventId}-${Date.now()}`,
        description: "A newly uploaded photo",
        imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
        imageHint: "community event",
        eventId: eventId,
    };
    addImageToEvent(eventId, newImage);
    toast({
        title: "Photo Uploaded! (Simulated)",
        description: "Your photo has been added to the album.",
    });
    setUploadModalOpen(false);
    setSelectedEventForUpload(null);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
            <div className='flex flex-col items-center justify-center'>
                <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-full shadow-inner border border-primary/20">
                    <ImageIcon className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mt-4">
                    Photo Gallery
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
                    A collection of moments from our past events.
                </p>
                {canUpload && (
                     <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="mt-6">
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add Photos
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md glass-card">
                            <DialogHeader>
                                <DialogTitle>Upload Photo to an Album</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <p className='text-sm text-muted-foreground'>This is a simulation. Select an event album and click upload to add a new random placeholder image.</p>
                                <Select onValueChange={setSelectedEventForUpload}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an event album" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pastEvents.map((event) => (
                                            <SelectItem key={event.id} value={String(event.id)}>
                                                {event.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input type="file" disabled />
                                <Button onClick={handleUpload} className="w-full" disabled={!selectedEventForUpload}>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Upload to Album
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </motion.div>

        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {albums.map(album => (
                album.images.length > 0 ? (
                    <motion.div key={album.id} variants={itemVariants}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Card className="group relative overflow-hidden rounded-lg cursor-pointer glass-card h-full flex flex-col">
                                <CardContent className="p-0">
                                    <Image
                                        src={album.images[0].imageUrl}
                                        alt={album.images[0].description}
                                        width={400}
                                        height={300}
                                        className="object-cover w-full aspect-video transition-transform duration-300 group-hover:scale-105"
                                    />
                                </CardContent>
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <h3 className="font-semibold text-base leading-tight truncate">{album.name}</h3>
                                    <p className="text-sm text-muted-foreground">{album.images.length} photos</p>
                                </div>
                            </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl p-4 md:p-6 glass-card">
                             <DialogHeader>
                                <DialogTitle>{album.name}</DialogTitle>
                                <DialogDescription>
                                    Browse photos from this event.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4 max-h-[70vh] overflow-y-auto">
                                {album.images.map((image, idx) => (
                                    <motion.div key={`${image.id}-${idx}`} variants={itemVariants}>
                                        <div className="group relative rounded-lg overflow-hidden">
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.description}
                                                width={400}
                                                height={300}
                                                className="object-cover w-full h-full aspect-square transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <Maximize className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                    </motion.div>
                ) : null
            ))}
        </motion.div>
        {albums.filter(a => a.images.length > 0).length === 0 && (
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 col-span-full">
                <p className='text-lg font-medium'>No Photos Yet</p>
                <p className="text-muted-foreground mt-2">Photos from past events will appear here.</p>
            </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
