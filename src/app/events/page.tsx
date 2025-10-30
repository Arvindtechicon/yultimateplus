import { events, venues, organizations } from '@/lib/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building, Users, Trophy, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

const eventTypeIcons: Record<string, React.ReactNode> = {
  Tournament: <Trophy className="w-3.5 h-3.5 mr-1.5" />,
  Workshop: <Wrench className="w-3.5 h-3.5 mr-1.5" />,
  Meetup: <Users className="w-3.5 h-3.5 mr-1.5" />,
};

export default function EventListPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">All Events</h1>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
          Browse through all the exciting Ultimate Frisbee events.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => {
          const venue = venues.find(v => v.id === event.venueId);
          const organization = organizations.find(o => o.id === event.organizationId);
          const placeholderImage = placeholderImages.placeholderImages[index % placeholderImages.placeholderImages.length];

          return (
            <Card key={event.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <div className="relative w-full h-48">
                <Image
                  src={placeholderImage.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  data-ai-hint={placeholderImage.imageHint}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                <div className="flex items-center gap-2 text-sm pt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{venue?.name}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{organization?.name}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                <Badge variant="secondary" className="flex items-center">
                  {eventTypeIcons[event.type]}
                  {event.type}
                </Badge>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.participants.length} going</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
