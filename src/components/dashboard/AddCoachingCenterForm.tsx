
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CoachingCenter } from "@/lib/mockData";

const formSchema = z.object({
  name: z.string().min(3, { message: "Center name must be at least 3 characters." }),
  specialty: z.string().min(3, { message: "Specialty must be at least 3 characters." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  fee: z.coerce.number().min(0, { message: "Fee must be a positive number." }),
  schedule: z.string().min(3, { message: "Schedule must be at least 3 characters." }),
});

type AddCenterFormValues = z.infer<typeof formSchema>;

interface AddCoachingCenterFormProps {
  onSubmit: (data: Omit<CoachingCenter, 'id' | 'participants'>) => void;
  onCancel: () => void;
}

export default function AddCoachingCenterForm({ onSubmit, onCancel }: AddCoachingCenterFormProps) {
  const form = useForm<AddCenterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      location: "",
      description: "",
      fee: 0,
      schedule: "",
    },
  });

  const handleSubmit = (data: AddCenterFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Center Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ultimate Performance Academy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the coaching center..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Specialty</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Advanced Skills" {...field} />
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
                <FormLabel>Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Cityville" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Fee (INR)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g. 5000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Schedule</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Mon, Wed, Fri: 6-8 PM" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Create Center</Button>
        </div>
      </form>
    </Form>
  );
}
