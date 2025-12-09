// "use client";

// import { useEffect, useState } from "react";
// import PageLayout from "@/components/dashboard/PageLayout";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import {
//     Search,
//     Plus,
//     MoreHorizontal,
//     Eye,
//     Trash2,
//     Calendar,
//     MapPin,
//     Users,
// } from "lucide-react";

// export default function EventsPage() {
//     const token = localStorage.getItem("token");
//     const [events, setEvents] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//     const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//     const [eventToDelete, setEventToDelete] = useState(null);

//     const fetchEvents = async () => {};
//     const createEvent = async (data) => {};
//     const updateEvent = async (id, data) => {};
//     const deleteEvent = async (id) => {};

//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         date: "",
//         venue: "",
//     });

//     useEffect(() => {
//         fetchEvents();
//     }, [fetchEvents]);

//     const filteredEvents = events.filter(
//         (event) =>
//             event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             event.venue?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     const handleCreateEvent = async () => {
//         try {
//             await createEvent(formData);
//             toast.success("Event created successfully");
//             setIsCreateDialogOpen(false);
//             setFormData({ title: "", description: "", date: "", venue: "" });
//         } catch {
//             toast.error("Failed to create event");
//         }
//     };

//     const handleDeleteEvent = async () => {
//         if (!eventToDelete) return;
//         try {
//             await deleteEvent(eventToDelete);
//             toast.success("Event deleted successfully");
//             setIsDeleteDialogOpen(false);
//             setEventToDelete(null);
//         } catch {
//             toast.error("Failed to delete event");
//         }
//     };

//     const upcomingEvents = events.filter(
//         (e) => new Date(e.date) >= new Date()
//     ).length;
//     const pastEvents = events.filter(
//         (e) => new Date(e.date) < new Date()
//     ).length;

//     return (
//         <PageLayout>
//             <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-3xl font-bold tracking-tight">
//                             Events
//                         </h1>
//                         <p className="text-muted-foreground">
//                             Manage alumni events and gatherings
//                         </p>
//                     </div>
//                     <Dialog
//                         open={isCreateDialogOpen}
//                         onOpenChange={setIsCreateDialogOpen}
//                     >
//                         <DialogTrigger asChild>
//                             <Button>
//                                 <Plus className="mr-2 h-4 w-4" />
//                                 Create Event
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent className="max-w-md">
//                             <DialogHeader>
//                                 <DialogTitle>Create New Event</DialogTitle>
//                                 <DialogDescription>
//                                     Add a new event to the platform
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <div className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="title">Event Title</Label>
//                                     <Input
//                                         id="title"
//                                         value={formData.title}
//                                         onChange={(e) =>
//                                             setFormData({
//                                                 ...formData,
//                                                 title: e.target.value,
//                                             })
//                                         }
//                                         placeholder="e.g., Annual Alumni Meet 2025"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="date">Date & Time</Label>
//                                     <Input
//                                         id="date"
//                                         type="datetime-local"
//                                         value={formData.date}
//                                         onChange={(e) =>
//                                             setFormData({
//                                                 ...formData,
//                                                 date: e.target.value,
//                                             })
//                                         }
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="venue">Venue</Label>
//                                     <Input
//                                         id="venue"
//                                         value={formData.venue}
//                                         onChange={(e) =>
//                                             setFormData({
//                                                 ...formData,
//                                                 venue: e.target.value,
//                                             })
//                                         }
//                                         placeholder="e.g., Main Auditorium"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="description">
//                                         Description
//                                     </Label>
//                                     <Textarea
//                                         id="description"
//                                         value={formData.description}
//                                         onChange={(e) =>
//                                             setFormData({
//                                                 ...formData,
//                                                 description: e.target.value,
//                                             })
//                                         }
//                                         placeholder="Event description..."
//                                         rows={3}
//                                     />
//                                 </div>
//                             </div>
//                             <DialogFooter>
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => setIsCreateDialogOpen(false)}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     onClick={handleCreateEvent}
//                                     disabled={!formData.title || !formData.date}
//                                 >
//                                     Create Event
//                                 </Button>
//                             </DialogFooter>
//                         </DialogContent>
//                     </Dialog>
//                 </div>

//                 {/* Stats - Sarthak Theme */}
//                 <div className="grid gap-4 md:grid-cols-3">
//                     <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
//                         <div className="flex items-center justify-between mb-4">
//                             <span className="text-[#7088aa] text-sm font-medium">
//                                 Total Events
//                             </span>
//                             <div className="p-2 bg-[#e4f0ff] rounded-xl">
//                                 <Calendar className="h-4 w-4 text-[#4a5f7c]" />
//                             </div>
//                         </div>
//                         <p className="text-4xl font-extrabold text-[#001145]">
//                             {events.length}
//                         </p>
//                     </div>
//                     <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
//                         <div className="flex items-center justify-between mb-4">
//                             <span className="text-[#7088aa] text-sm font-medium">
//                                 Upcoming
//                             </span>
//                             <div className="p-2 bg-[#e4f0ff] rounded-xl">
//                                 <Calendar className="h-4 w-4 text-[#4a5f7c]" />
//                             </div>
//                         </div>
//                         <p className="text-4xl font-extrabold text-[#001145]">
//                             {upcomingEvents}
//                         </p>
//                     </div>
//                     <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
//                         <div className="flex items-center justify-between mb-4">
//                             <span className="text-[#7088aa] text-sm font-medium">
//                                 Past Events
//                             </span>
//                             <div className="p-2 bg-[#e4f0ff] rounded-xl">
//                                 <Calendar className="h-4 w-4 text-[#4a5f7c]" />
//                             </div>
//                         </div>
//                         <p className="text-4xl font-extrabold text-[#001145]">
//                             {pastEvents}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Events Table */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>All Events</CardTitle>
//                         <CardDescription>
//                             View and manage all events
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="flex items-center gap-4 mb-4">
//                             <div className="relative flex-1 max-w-sm">
//                                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                                 <Input
//                                     placeholder="Search events..."
//                                     value={searchQuery}
//                                     onChange={(e) =>
//                                         setSearchQuery(e.target.value)
//                                     }
//                                     className="pl-9"
//                                 />
//                             </div>
//                         </div>

//                         <div className="rounded-md border">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow>
//                                         <TableHead>Title</TableHead>
//                                         <TableHead>Date</TableHead>
//                                         <TableHead>Venue</TableHead>
//                                         <TableHead>Registrations</TableHead>
//                                         <TableHead>Status</TableHead>
//                                         <TableHead className="w-[80px]">
//                                             Actions
//                                         </TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {isLoading ? (
//                                         Array.from({ length: 5 }).map(
//                                             (_, i) => (
//                                                 <TableRow key={i}>
//                                                     <TableCell>
//                                                         <Skeleton className="h-4 w-40" />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Skeleton className="h-4 w-24" />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Skeleton className="h-4 w-28" />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Skeleton className="h-4 w-16" />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Skeleton className="h-6 w-20" />
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Skeleton className="h-8 w-8" />
//                                                     </TableCell>
//                                                 </TableRow>
//                                             )
//                                         )
//                                     ) : filteredEvents.length === 0 ? (
//                                         <TableRow>
//                                             <TableCell
//                                                 colSpan={6}
//                                                 className="text-center py-8"
//                                             >
//                                                 <p className="text-muted-foreground">
//                                                     No events found
//                                                 </p>
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : (
//                                         filteredEvents.map((event) => {
//                                             const isUpcoming =
//                                                 new Date(event.date) >=
//                                                 new Date();
//                                             return (
//                                                 <TableRow key={event._id}>
//                                                     <TableCell className="font-medium">
//                                                         {event.title}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         {new Date(
//                                                             event.date
//                                                         ).toLocaleDateString(
//                                                             "en-US",
//                                                             {
//                                                                 year: "numeric",
//                                                                 month: "short",
//                                                                 day: "numeric",
//                                                                 hour: "2-digit",
//                                                                 minute: "2-digit",
//                                                             }
//                                                         )}
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <div className="flex items-center gap-1">
//                                                             <MapPin className="h-3 w-3 text-muted-foreground" />
//                                                             {event.venue ||
//                                                                 "TBA"}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <div className="flex items-center gap-1">
//                                                             <Users className="h-3 w-3 text-muted-foreground" />
//                                                             {Array.isArray(
//                                                                 event.registeredUsers
//                                                             )
//                                                                 ? event
//                                                                       .registeredUsers
//                                                                       .length
//                                                                 : 0}
//                                                         </div>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <Badge
//                                                             variant={
//                                                                 isUpcoming
//                                                                     ? "default"
//                                                                     : "secondary"
//                                                             }
//                                                         >
//                                                             {isUpcoming
//                                                                 ? "Upcoming"
//                                                                 : "Past"}
//                                                         </Badge>
//                                                     </TableCell>
//                                                     <TableCell>
//                                                         <DropdownMenu>
//                                                             <DropdownMenuTrigger
//                                                                 asChild
//                                                             >
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="icon"
//                                                                 >
//                                                                     <MoreHorizontal className="h-4 w-4" />
//                                                                 </Button>
//                                                             </DropdownMenuTrigger>
//                                                             <DropdownMenuContent align="end">
//                                                                 <DropdownMenuItem
//                                                                     onClick={() => {
//                                                                         setSelectedEvent(
//                                                                             event
//                                                                         );
//                                                                         setIsViewDialogOpen(
//                                                                             true
//                                                                         );
//                                                                     }}
//                                                                 >
//                                                                     <Eye className="mr-2 h-4 w-4" />
//                                                                     View Details
//                                                                 </DropdownMenuItem>
//                                                                 <DropdownMenuItem
//                                                                     className="text-destructive"
//                                                                     onClick={() => {
//                                                                         setEventToDelete(
//                                                                             event._id
//                                                                         );
//                                                                         setIsDeleteDialogOpen(
//                                                                             true
//                                                                         );
//                                                                     }}
//                                                                 >
//                                                                     <Trash2 className="mr-2 h-4 w-4" />
//                                                                     Delete
//                                                                 </DropdownMenuItem>
//                                                             </DropdownMenuContent>
//                                                         </DropdownMenu>
//                                                     </TableCell>
//                                                 </TableRow>
//                                             );
//                                         })
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* View Dialog */}
//                 <Dialog
//                     open={isViewDialogOpen}
//                     onOpenChange={setIsViewDialogOpen}
//                 >
//                     <DialogContent className="max-w-lg">
//                         <DialogHeader>
//                             <DialogTitle>{selectedEvent?.title}</DialogTitle>
//                             <DialogDescription>Event details</DialogDescription>
//                         </DialogHeader>
//                         {selectedEvent && (
//                             <div className="space-y-4">
//                                 <div className="flex gap-2">
//                                     <Badge
//                                         variant={
//                                             new Date(selectedEvent.date) >=
//                                             new Date()
//                                                 ? "default"
//                                                 : "secondary"
//                                         }
//                                     >
//                                         {new Date(selectedEvent.date) >=
//                                         new Date()
//                                             ? "Upcoming"
//                                             : "Past"}
//                                     </Badge>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-medium text-muted-foreground">
//                                         Date & Time
//                                     </label>
//                                     <p className="text-sm flex items-center gap-2 mt-1">
//                                         <Calendar className="h-4 w-4" />
//                                         {new Date(
//                                             selectedEvent.date
//                                         ).toLocaleDateString("en-US", {
//                                             weekday: "long",
//                                             year: "numeric",
//                                             month: "long",
//                                             day: "numeric",
//                                             hour: "2-digit",
//                                             minute: "2-digit",
//                                         })}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-medium text-muted-foreground">
//                                         Venue
//                                     </label>
//                                     <p className="text-sm flex items-center gap-2 mt-1">
//                                         <MapPin className="h-4 w-4" />
//                                         {selectedEvent.venue ||
//                                             "To be announced"}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-medium text-muted-foreground">
//                                         Description
//                                     </label>
//                                     <p className="text-sm mt-1">
//                                         {selectedEvent.description ||
//                                             "No description provided"}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-medium text-muted-foreground">
//                                         Registrations
//                                     </label>
//                                     <p className="text-sm flex items-center gap-2 mt-1">
//                                         <Users className="h-4 w-4" />
//                                         {Array.isArray(
//                                             selectedEvent.registeredUsers
//                                         )
//                                             ? selectedEvent.registeredUsers
//                                                   .length
//                                             : 0}{" "}
//                                         registered
//                                     </p>
//                                 </div>
//                             </div>
//                         )}
//                     </DialogContent>
//                 </Dialog>

//                 {/* Delete Confirmation */}
//                 <AlertDialog
//                     open={isDeleteDialogOpen}
//                     onOpenChange={setIsDeleteDialogOpen}
//                 >
//                     <AlertDialogContent>
//                         <AlertDialogHeader>
//                             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                             <AlertDialogDescription>
//                                 This action cannot be undone. This will
//                                 permanently delete the event.
//                             </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction onClick={handleDeleteEvent}>
//                                 Delete
//                             </AlertDialogAction>
//                         </AlertDialogFooter>
//                     </AlertDialogContent>
//                 </AlertDialog>
//             </div>
//         </PageLayout>
//     );
// }
