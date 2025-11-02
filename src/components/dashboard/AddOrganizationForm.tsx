
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
import type { Organization } from "@/lib/mockData";

const formSchema = z.object({
  name: z.string().min(3, { message: "Organization name must be at least 3 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddOrganizationFormProps {
  onSubmit: (data: Omit<Organization, "id" | "organizers">) => void;
  onCancel: () => void;
}

export default function AddOrganizationForm({ onSubmit, onCancel }: AddOrganizationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Y-Ultimate Sports" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Create Organization</Button>
        </div>
      </form>
    </Form>
  );
}
