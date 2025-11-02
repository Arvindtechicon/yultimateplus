"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import QRCodeComponent from 'qrcode.react';
import { format } from "date-fns";
import type { Event } from "@/lib/mockData";
import { Calendar } from "lucide-react";

interface EventQrCardProps {
    event: Event;
    qrValue: string;
}

export default function EventQrCard({ event, qrValue }: EventQrCardProps) {

    return (
        <Card className="glass-card flex flex-col items-center text-center p-4">
            <CardHeader className="p-2">
                <CardTitle className="text-lg leading-tight">{event.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 pt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(event.date), 'PPP p')}</span>
                 </CardDescription>
            </CardHeader>
            <CardContent className="p-2">
                <div className="bg-white p-2 rounded-md shadow-md">
                    <QRCodeComponent value={qrValue} size={160} />
                </div>
            </CardContent>
            <CardFooter className="p-2">
                <Badge variant={event.type === 'Tournament' ? 'default' : 'secondary'}>{event.type}</Badge>
            </CardFooter>
        </Card>
    )
}
