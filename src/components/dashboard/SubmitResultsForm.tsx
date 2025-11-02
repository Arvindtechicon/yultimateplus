
"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import type { Event, Team } from "@/lib/mockData";
import { Input } from "../ui/input";
import { Trophy, Shield } from "lucide-react";

export type TeamResult = { teamId: string; spiritScore: number };

const formSchema = z.object({
  first: z.object({
    teamId: z.string().min(1),
    spiritScore: z.coerce.number().min(0).max(15),
  }),
  second: z.object({
    teamId: z.string().min(1),
    spiritScore: z.coerce.number().min(0).max(15),
  }),
  third: z.object({
    teamId: z.string().min(1),
    spiritScore: z.coerce.number().min(0).max(15),
  }),
  highlights: z.string().min(10, { message: "Highlights must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmitResultsFormProps {
  event: Event;
  teams: Team[];
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

export default function SubmitResultsForm({ event, teams, onSubmit, onCancel }: SubmitResultsFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        first: { teamId: '', spiritScore: 10 },
        second: { teamId: '', spiritScore: 10 },
        third: { teamId: '', spiritScore: 10 },
        highlights: event.highlights || "",
    },
  });

  const watchSelectedTeams = [
    form.watch("first.teamId"),
    form.watch("second.teamId"),
    form.watch("third.teamId"),
  ];

  const renderTeamSelect = (field: any, placeholder: string, currentRank: 'first' | 'second' | 'third') => (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {teams
          .filter(team => {
            const isSelectedElsewhere = watchSelectedTeams.some(
              (selectedId, index) => {
                const rankOrder = ['first', 'second', 'third'];
                return selectedId === team.id && rankOrder[index] !== currentRank;
              }
            );
            return !isSelectedElsewhere;
          })
          .map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        
        {/* First Place */}
        <div className="grid grid-cols-3 items-end gap-4 p-4 border rounded-lg bg-muted/30">
            <div className="col-span-2 space-y-2">
                <FormField
                control={form.control}
                name="first.teamId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold text-amber-500"><Trophy/> 1st Place</FormLabel>
                        {renderTeamSelect(field, "Select 1st place team", "first")}
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="first.spiritScore"
                render={({ field }) => (
                    <FormItem>
                         <FormLabel className="flex items-center gap-2"><Shield/> Spirit</FormLabel>
                        <FormControl>
                            <Input type="number" min={0} max={15} {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>

        {/* Second Place */}
        <div className="grid grid-cols-3 items-end gap-4 p-4 border rounded-lg">
            <div className="col-span-2 space-y-2">
                <FormField
                control={form.control}
                name="second.teamId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold text-slate-500"><Trophy/> 2nd Place</FormLabel>
                        {renderTeamSelect(field, "Select 2nd place team", "second")}
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="second.spiritScore"
                render={({ field }) => (
                    <FormItem>
                         <FormLabel className="flex items-center gap-2"><Shield/> Spirit</FormLabel>
                        <FormControl>
                            <Input type="number" min={0} max={15} {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>

        {/* Third Place */}
        <div className="grid grid-cols-3 items-end gap-4 p-4 border rounded-lg">
            <div className="col-span-2 space-y-2">
                <FormField
                control={form.control}
                name="third.teamId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="flex items-center gap-2 font-semibold text-amber-700"><Trophy/> 3rd Place</FormLabel>
                        {renderTeamSelect(field, "Select 3rd place team", "third")}
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="third.spiritScore"
                render={({ field }) => (
                    <FormItem>
                         <FormLabel className="flex items-center gap-2"><Shield/> Spirit</FormLabel>
                        <FormControl>
                            <Input type="number" min={0} max={15} {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="highlights"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Match Highlights</FormLabel>
                <FormControl>
                    <Textarea placeholder="Briefly describe key moments from the final matches..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Results</Button>
        </div>
      </form>
    </Form>
  );
}
