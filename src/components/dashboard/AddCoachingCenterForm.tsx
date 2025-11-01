
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
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Create Center</Button>
        </div>
      </form>
    </Form>
  );
}
