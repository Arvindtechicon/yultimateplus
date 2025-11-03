
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
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Organizer } from '@/lib/mockData';
import { useFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formSchema = z
  .object({
    personalName: z
      .string()
      .min(2, { message: 'Your name must be at least 2 characters.' }),
    orgName: z
      .string()
      .min(2, { message: 'Organization name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    phone: z
      .string()
      .regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof formSchema>;

export default function OrganizerRegistrationForm() {
  const { register } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalName: '',
      orgName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // 1. Register the user via AuthContext
      const userCredential = await register(data.email, data.password, {
        name: data.personalName,
        role: 'Organizer',
        phone: data.phone,
        orgName: data.orgName,
        events: [],
      });

      // 2. Create the organization in Firestore
      const newOrg = {
        name: data.orgName,
        organizers: [userCredential.user.uid],
      };
      
      const orgsCollectionRef = collection(firestore, 'organizations');

      // Use non-blocking write with contextual error handling
      addDoc(orgsCollectionRef, newOrg).catch(serverError => {
          const permissionError = new FirestorePermissionError({
              path: orgsCollectionRef.path,
              operation: 'create',
              requestResourceData: newOrg
          });
          errorEmitter.emit('permission-error', permissionError);

          // We can still show a generic error to the user while the detailed
          // error is shown in the dev overlay.
          toast({
              variant: 'destructive',
              title: 'Organization Creation Failed',
              description: 'You may not have the required permissions.'
          });
      });

      toast({
        title: '✅ Registration Successful!',
        description: `Welcome, ${data.personalName}! Your organizer account is ready.`,
      });
      
    } catch (error: any) {
      // This catch block will now primarily handle errors from the `register` function (Auth),
      // as the Firestore error is handled in the `.catch` block above.
      // The toast for auth errors is handled within AuthContext's register function.
    } finally {
      setIsLoading(false);
    }
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
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Create Organizer Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
