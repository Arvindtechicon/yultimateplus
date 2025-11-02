'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Participant } from '@/lib/mockData';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ParticipantRegistrationForm() {
  const { users, addUser, addParticipant } = useAppData();
  const { loginFromRegistration } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    setIsLoading(true);
    const emailExists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (emailExists) {
      form.setError('email', {
        type: 'manual',
        message: 'An account with this email already exists. Please login.',
      });
      setIsLoading(false);
      return;
    }
    
    const id = `P${Date.now().toString(36).slice(-6)}`;
    const newUser: Participant = {
        id,
        name: data.fullName,
        email: data.email,
        role: 'Participant',
        phone: data.phone,
        location: data.location,
        registeredEvents: [],
        qrCode: `QR-${id}`
    };

    addUser(newUser);
    addParticipant(newUser);
    
    toast({
      title: '✅ Registration Successful!',
      description: `Welcome, ${data.fullName}! Redirecting to your dashboard...`,
    });

    loginFromRegistration(newUser);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                    <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>City / Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Mysore" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
        </Button>
      </form>
    </Form>
  );
}
