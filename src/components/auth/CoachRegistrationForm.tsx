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
import type { Coach } from '@/lib/mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCommunities } from '@/lib/mockData';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().regex(/^\d{10}$/, { message: 'Phone number must be 10 digits.' }),
  communities: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one community.',
  }),
  experienceYears: z.coerce.number().min(0, { message: 'Experience must be a positive number.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CoachRegistrationForm() {
  const { users, addUser, addCoach } = useAppData();
  const { loginFromRegistration } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      communities: [],
      experienceYears: 0,
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
    
    const id = `C${Date.now().toString(36).slice(-6)}`;
    const newUser: Coach = {
        id,
        name: data.fullName,
        email: data.email,
        role: 'Coach',
        phone: data.phone,
        communities: data.communities,
        sessions: []
    };

    addUser(newUser);
    addCoach(newUser);
    
    toast({
      title: '✅ Registration Successful!',
      description: `Welcome, ${data.fullName}! Your coach account is ready.`,
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
                    <Input placeholder="Jane Smith" {...field} />
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
                    <Input type="email" placeholder="jane.smith@example.com" {...field} />
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
            name="experienceYears"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="communities"
            render={() => (
                <FormItem>
                <div className="mb-4">
                    <FormLabel className="text-base">Communities</FormLabel>
                </div>
                <div className="flex flex-wrap gap-4">
                {mockCommunities.map((item) => (
                    <FormField
                    key={item.name}
                    control={form.control}
                    name="communities"
                    render={({ field }) => {
                        return (
                        <FormItem
                            key={item.name}
                            className="flex flex-row items-start space-x-3 space-y-0"
                        >
                            <FormControl>
                            <Checkbox
                                checked={field.value?.includes(item.name)}
                                onCheckedChange={(checked) => {
                                return checked
                                    ? field.onChange([...(field.value || []), item.name])
                                    : field.onChange(
                                        field.value?.filter(
                                        (value) => value !== item.name
                                        )
                                    )
                                }}
                            />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {item.name}
                            </FormLabel>
                        </FormItem>
                        )
                    }}
                    />
                ))}
                </div>
                <FormMessage />
                </FormItem>
            )}
        />


        <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Coach Account'}
        </Button>
      </form>
    </Form>
  );
}
