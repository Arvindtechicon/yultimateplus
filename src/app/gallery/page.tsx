
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize, Upload } from 'lucide-react';
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
    const [isUploadModalOpen, setUploadModalOpen] = useState<string | null>(null);

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


  const handleUpload = (eventId: number) => {
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
    setUploadModalOpen(null);
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
          <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-full shadow-inner border border-primary/20">
            <ImageIcon className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Photo Gallery
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            A collection of moments from our past events.
          </p>
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
                                    {canUpload && (
                                        <Dialog open={isUploadModalOpen === `upload-${album.id}`} onOpenChange={(isOpen) => !isOpen && setUploadModalOpen(null)}>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="mt-2" onClick={() => setUploadModalOpen(`upload-${album.id}`)}>
                                                    <Upload className="mr-2 h-4 w-4"/>
                                                    Upload Photo
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md glass-card">
                                                <DialogHeader>
                                                    <DialogTitle>Upload Photo to {album.name}</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4 space-y-4">
                                                    <p className='text-sm text-muted-foreground'>This is a simulation. Click upload to add a new random placeholder image to the album.</p>
                                                    <Input type="file" disabled />
                                                    <Button onClick={() => handleUpload(album.id)} className="w-full">
                                                        <Upload className="mr-2 h-4 w-4"/>
                                                        Upload
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
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

      </div>
    </DashboardLayout>
  );
}
