
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, PlusCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import AddOrganizationForm from '@/components/dashboard/AddOrganizationForm';
import type { Organization } from '@/lib/mockData';

export default function OrganizationsPage() {
  const { user } = useAuth();
  const { organizations, addOrganization } = useAppData();
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  if (!user || user.role !== 'Admin') {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <p>You must be an admin to view this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleAddOrganization = (data: Omit<Organization, 'id' | 'organizers'>) => {
    addOrganization(data);
    setAddModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Building className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Organizations
          </h1>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">
            Manage all the organizations running events on the platform.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full max-w-2xl mx-auto glass-card">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>All Organizations ({organizations.length})</CardTitle>
                <CardDescription>
                  View and manage organizations.
                </CardDescription>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                  <DialogHeader>
                    <DialogTitle>Add New Organization</DialogTitle>
                  </DialogHeader>
                  <AddOrganizationForm
                    onSubmit={handleAddOrganization}
                    onCancel={() => setAddModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization Name</TableHead>
                    <TableHead className="text-right">Organizers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell className="text-right">
                        {org.organizers.length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
