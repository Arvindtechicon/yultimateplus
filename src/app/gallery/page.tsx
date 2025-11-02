
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize, Upload, PlusCircle, Trash2 } from 'lucide-react';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';


export default function GalleryPage() {
    const { events, addImageToEvent, tempEventImages, addEvent, deleteImageFromEvent } = useAppData();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedEventForUpload, setSelectedEventForUpload] = useState<string | null>(null);
    const [uploadMode, setUploadMode] = useState<'existing' | 'new'>('existing');
    const [newAlbumName, setNewAlbumName] = useState('');
    const [newAlbumDesc, setNewAlbumDesc] = useState('');

    const canManagePhotos = user?.role === 'Admin' || user?.role === 'Organizer';
    
    const pastEvents = events.filter(e => new Date(e.date) < new Date());
    
    const albums = pastEvents.map((event) => {
        const existingImages = PlaceHolderImages.filter(img => img.eventId === event.id);
        const newImages = tempEventImages[event.id] || [];
      
        return {
          ...event,
          images: [...existingImages, ...newImages],
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  const handleUpload = () => {
    let eventId: number | null = null;
    let eventName: string | undefined = '';

    if (uploadMode === 'existing') {
        if (!selectedEventForUpload) {
            toast({
                variant: "destructive",
                title: "No Event Selected",
                description: "Please select an event to upload the photo to.",
            });
            return;
        }
        eventId = parseInt(selectedEventForUpload, 10);
        eventName = events.find(e => e.id === eventId)?.name;
    } else { // new album
        if (!newAlbumName.trim() || !newAlbumDesc.trim()) {
            toast({
                variant: "destructive",
                title: "Album Details Missing",
                description: "Please provide a name and description for the new album.",
            });
            return;
        }
        // Create a new mock event to act as an album
        const newEvent = addEvent({
            name: newAlbumName,
            description: newAlbumDesc,
            date: new Date().toISOString(),
            venueId: 1, // Mock venue
            organizationId: 1, // Mock org
            type: 'Meetup',
        });
        eventId = newEvent.id;
        eventName = newEvent.name;
    }

    if (eventId === null) return;

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
        description: `Your photo has been added to the "${eventName}" album.`,
    });

    // Reset state
    setUploadModalOpen(false);
    setSelectedEventForUpload(null);
    setNewAlbumName('');
    setNewAlbumDesc('');
    setUploadMode('existing');
  }

  const handleDeleteImage = (eventId: number, imageId: string) => {
    deleteImageFromEvent(eventId, imageId);
    toast({
        variant: "destructive",
        title: "Photo Deleted",
        description: "The photo has been removed from the album.",
    });
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
                {canManagePhotos && (
                     <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="mt-6">
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add Photos
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg glass-card">
                            <DialogHeader>
                                <DialogTitle>Upload Photo to an Album</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                               <RadioGroup defaultValue="existing" onValueChange={(value: 'existing' | 'new') => setUploadMode(value)} className="grid grid-cols-2 gap-4">
                                  <div>
                                    <RadioGroupItem value="existing" id="r1" className="peer sr-only" />
                                    <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                      Select Existing Album
                                    </Label>
                                  </div>
                                  <div>
                                    <RadioGroupItem value="new" id="r2" className="peer sr-only" />
                                    <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                      Create New Album
                                    </Label>
                                  </div>
                                </RadioGroup>

                                {uploadMode === 'existing' ? (
                                    <div className='space-y-4 pt-4'>
                                        <p className='text-sm text-muted-foreground'>Select an existing event album and click upload to add a new random placeholder image.</p>
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
                                    </div>
                                ) : (
                                    <div className='space-y-4 pt-4'>
                                         <p className='text-sm text-muted-foreground'>Create a new album by providing a name and description. A new placeholder image will be added.</p>
                                        <div className='space-y-2'>
                                            <Label htmlFor='new-album-name'>New Album Name</Label>
                                            <Input id='new-album-name' value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} placeholder="e.g. Community Day 2024" />
                                        </div>
                                         <div className='space-y-2'>
                                            <Label htmlFor='new-album-desc'>Description</Label>
                                            <Textarea id='new-album-desc' value={newAlbumDesc} onChange={(e) => setNewAlbumDesc(e.target.value)} placeholder="A short description for the new album." />
                                        </div>
                                    </div>
                                )}
                                
                                <Input type="file" disabled className='mt-4' />
                                <Button onClick={handleUpload} className="w-full" disabled={(uploadMode === 'existing' && !selectedEventForUpload) || (uploadMode === 'new' && (!newAlbumName.trim() || !newAlbumDesc.trim()))}>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    {uploadMode === 'existing' ? 'Upload to Selected Album' : 'Create & Upload to New Album'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </motion.div>

        <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {albums.map((album, index) => (
                album.images.length > 0 ? (
                    <motion.div 
                        key={album.id} 
                        variants={itemVariants} 
                        className={`relative rounded-lg overflow-hidden group
                            ${index === 0 ? 'col-span-2 row-span-2' : ''}
                            ${index === 3 ? 'md:col-span-2' : ''}
                        `}
                    >
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="w-full h-full cursor-pointer">
                                <Image
                                    src={album.images[0].imageUrl}
                                    alt={album.images[0].description}
                                    layout='fill'
                                    objectFit='cover'
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                    <h3 className="font-semibold text-lg leading-tight truncate">{album.name}</h3>
                                    <p className="text-sm opacity-80">{album.images.length} photos</p>
                                </div>
                            </div>
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
                                            {canManagePhotos && image.id.startsWith('temp-') && (
                                                 <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the photo from this album.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteImage(album.id, image.id)}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
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
