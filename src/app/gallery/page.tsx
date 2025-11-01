
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Maximize } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppData } from '@/context/EventContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function GalleryPage() {
    const { events } = useAppData();
    const pastEvents = events.filter(e => new Date(e.date) < new Date());
    
    // Assign images to past events for a mock album structure.
    const albums = pastEvents.map((event, index) => ({
      ...event,
      images: PlaceHolderImages.slice(index * 2, (index + 1) * 2), // Assign 2 images per event
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
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
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <Accordion type="single" collapsible className="w-full">
                {albums.map(album => (
                    <AccordionItem value={`item-${album.id}`} key={album.id}>
                        <AccordionTrigger className='text-xl font-semibold hover:no-underline'>
                            {album.name}
                        </AccordionTrigger>
                        <AccordionContent>
                             <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 py-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {album.images.map((image) => (
                                    <motion.div key={image.id} variants={itemVariants}>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                        <div className="group relative rounded-lg overflow-hidden cursor-pointer">
                                            <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            width={400}
                                            height={300}
                                            className="object-cover w-full h-full aspect-video transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <Maximize className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl p-0 border-0 glass-card">
                                        <Image
                                            src={image.imageUrl}
                                            alt={image.description}
                                            width={1200}
                                            height={800}
                                            className="object-contain w-full h-full rounded-lg"
                                        />
                                        </DialogContent>
                                    </Dialog>
                                    </motion.div>
                                ))}
                                {album.images.length === 0 && (
                                    <p className='col-span-full text-center text-muted-foreground py-4'>No images available for this event.</p>
                                )}
                            </motion.div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}

