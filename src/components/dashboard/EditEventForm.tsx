
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { Organization, Venue, Event } from "@/lib/mockData";
import { useAppData } from "@/context/EventContext";

const formSchema = z.object({
  name: z.string().min(3, { message: "Event name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  date: z.date({ required_error: "A date is required." }),
  venueName: z.string().min(3, { message: "Venue name must be at least 3 characters." }),
  organizationId: z.string().min(1, { message: "Please select an organization." }),
  type: z.enum(["Tournament", "Workshop", "Meetup"]),
});

type EditEventFormValues = z.infer<typeof formSchema>;

interface EditEventFormProps {
  event: Event;
  organizations: Organization[];
  onSubmit: (data: Omit<Event, 'id' | 'participants'>) => void;
  onCancel: () => void;
}

export default function EditEventForm({ event, organizations, onSubmit, onCancel }: EditEventFormProps) {
    const { venues, addVenue } = useAppData();
    const currentVenue = venues.find(v => v.id === event.venueId);

  const form = useForm<EditEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      date: new Date(event.date),
      venueName: currentVenue?.name || "",
      organizationId: String(event.organizationId),
      type: event.type,
    },
  });

  const handleSubmit = (data: EditEventFormValues) => {
    let venue = venues.find(v => v.name.toLowerCase() === data.venueName.toLowerCase());
    if (!venue) {
        venue = addVenue(data.venueName);
    }
    
    onSubmit({
      name: data.name,
      description: data.description,
      date: data.date.toISOString(),
      venueId: venue.id,
      organizationId: parseInt(data.organizationId),
      type: data.type,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Breeze Tournament" {...field} />
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
                <Textarea placeholder="Tell us about the event" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="venueName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Venue</FormLabel>
                 <FormControl>
                    <Input placeholder="Enter a venue name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {organizations.map((org) => (
                        <SelectItem key={org.id} value={String(org.id)}>
                        {org.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Meetup">Meetup</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
