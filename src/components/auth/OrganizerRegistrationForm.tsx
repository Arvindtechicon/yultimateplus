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
import type { Organizer } from '@/lib/mockData';

const formSchema = z.object({
  personalName: z.string().min(2, { message: 'Your name must be at least 2 characters.' }),
  orgName: z.string().min(2, { message: 'Organization name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function OrganizerRegistrationForm() {
  const { users, addUser, addOrganizer } = useAppData();
  const { loginFromRegistration } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalName: '',
      orgName: '',
      email: '',
      phone: '',
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
    
    const id = `O${Date.now().toString(36).slice(-6)}`;
    const newUser: Organizer = {
        id,
        name: data.personalName,
        email: data.email,
        role: 'Organizer',
        phone: data.phone,
        orgName: data.orgName,
        events: []
    };

    addUser(newUser);
    addOrganizer(newUser);
    
    toast({
      title: '✅ Registration Successful!',
      description: `Welcome, ${data.personalName}! Your organizer account is ready.`,
    });

    loginFromRegistration(newUser);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="personalName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Your Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="orgName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Ultimate Impact" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Organizer Account'}
        </Button>
      </form>
    </Form>
  );
}
