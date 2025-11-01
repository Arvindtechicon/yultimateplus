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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Child, Assessment } from "@/lib/mockData";
import { useState } from "react";

const formSchema = z.object({
  childId: z.string().min(1, { message: "Please select a child." }),
  type: z.enum(["Baseline", "Endline"]),
  teamwork: z.number().min(1).max(10),
  confidence: z.number().min(1).max(10),
  communication: z.number().min(1).max(10),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAssessmentFormProps {
  children: Child[];
  onSubmit: (data: Omit<Assessment, "date">) => void;
  onCancel: () => void;
}

export default function AddAssessmentForm({ children, onSubmit, onCancel }: AddAssessmentFormProps) {
    const [teamwork, setTeamwork] = useState(5);
    const [confidence, setConfidence] = useState(5);
    const [communication, setCommunication] = useState(5);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Baseline",
      teamwork: 5,
      confidence: 5,
      communication: 5,
    },
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit({
        childId: data.childId,
        type: data.type,
        score: {
            teamwork: data.teamwork,
            confidence: data.confidence,
            communication: data.communication,
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="childId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Child</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a child" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Baseline">Baseline</SelectItem>
                  <SelectItem value="Endline">Endline</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="teamwork"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Teamwork ({field.value})</FormLabel>
                    <FormControl>
                        <Slider
                            min={1} max={10} step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="confidence"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Confidence ({field.value})</FormLabel>
                    <FormControl>
                        <Slider
                            min={1} max={10} step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="communication"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Communication ({field.value})</FormLabel>
                    <FormControl>
                        <Slider
                            min={1} max={10} step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                        />
                    </FormControl>
                </FormItem>
            )}
        />

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Assessment</Button>
        </div>
      </form>
    </Form>
  );
}
