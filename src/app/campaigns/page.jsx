"use client";

import * as React from "react";
import { format, differenceInDays } from "date-fns";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    MoreHorizontal,
    DollarSign,
    Users,
    Target,
    TrendingUp,
    Calendar,
    Loader2,
} from "lucide-react";

import PageLayout from "@/components/dashboard/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { campaignsApi } from "@/lib/api";

const categoryLabels = {
    infrastructure: "Infrastructure",
    scholarship: "Scholarship",
    research: "Research",
    sustainability: "Sustainability",
    sports: "Sports",
    general: "General",
    technology: "Technology",
    other: "Other",
};

const statusColors = {
    draft: "secondary",
    pending: "outline",
    active: "default",
    completed: "default",
    cancelled: "destructive",
    inactive: "secondary",
};

export default function CampaignsPage() {
    const { toast } = useToast();
    const [campaigns, setCampaigns] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [categoryFilter, setCategoryFilter] = React.useState("all");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState(null);
    const [isSaving, setIsSaving] = React.useState(false);

    // UPDATED: State matches the input needs for the specific request body
    const [formData, setFormData] = React.useState({
        title: "",
        intent: "", // Replaces tagline
        description: "",
        category: "test", // Default category/tag
        targetFunds: 0,
        startDate: "",
        endDate: "",
    });

    const fetchCampaigns = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {};
            if (statusFilter !== "all") params.status = statusFilter;
            if (categoryFilter !== "all") params.category = categoryFilter;

            const response = await campaignsApi.getAll(params);
            setCampaigns(response.data?.data || []);
        } catch (error) {
            console.error("Fetch error:", error);
            toast({
                title: "Error",
                description: "Failed to fetch campaigns",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, categoryFilter, toast]);

    const analytics = React.useMemo(() => {
        if (!campaigns.length) return null;

        const totalCampaigns = campaigns.length;
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
        const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

        const totalRaised = campaigns.reduce((acc, c) => acc + (c.financials?.raisedFunds || 0), 0);
        const totalTarget = campaigns.reduce((acc, c) => acc + (c.financials?.targetFunds || 0), 0);
        const totalSupporters = campaigns.reduce((acc, c) => acc + (c.financials?.donorCount || 0), 0);

        const successRate = totalCampaigns > 0
            ? Math.round((completedCampaigns / totalCampaigns) * 100)
            : 0;

        return {
            totalCampaigns,
            activeCampaigns,
            completedCampaigns,
            successRate,
            funding: { totalRaised, totalTarget, totalSupporters }
        };
    }, [campaigns]);

    React.useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    // UPDATED: Handle Create with correct payload structure
    const handleCreate = async () => {
        try {
            setIsSaving(true);

            // Construct payload strictly matching the sample req.body
            const payload = {
                title: formData.title,
                description: formData.description,
                financials: {
                    targetFunds: Number(formData.targetFunds),
                    currency: "INR" // Hardcoded as per requirement
                },
                // Convert to ISO string (e.g., 2025-12-09T00:25:00.000Z)
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                intent: formData.intent,
                tags: [formData.category] // Wrapping category as a tag
            };

            await campaignsApi.create(payload);

            toast({
                title: "Success",
                description: "Campaign created successfully",
            });
            setIsDialogOpen(false);
            resetForm();
            fetchCampaigns();
        } catch (error) {
            console.error("Create error", error);
            toast({
                title: "Error",
                description: "Failed to create campaign",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleVerify = async (id) => {
        try {
            await campaignsApi.verify(id);
            toast({ title: "Success", description: "Campaign verified and activated" });
            fetchCampaigns();
        } catch {
            toast({ title: "Error", description: "Failed to verify campaign", variant: "destructive" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await campaignsApi.delete(id);
            toast({ title: "Success", description: "Campaign deleted" });
            fetchCampaigns();
        } catch {
            toast({ title: "Error", description: "Failed to delete campaign", variant: "destructive" });
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            intent: "",
            description: "",
            category: "general",
            targetFunds: 0,
            startDate: "",
            endDate: "",
        });
    };

    const filteredCampaigns = campaigns
        .filter(
            (c) =>
                c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const calculateProgress = (raised, target) => {
        if (!target || target === 0) return 0;
        return Math.min(Math.round((raised / target) * 100), 100);
    };

    const calculateDaysRemaining = (endDateStr) => {
        if (!endDateStr) return 0;
        const days = differenceInDays(new Date(endDateStr), new Date());
        return days > 0 ? days : 0;
    };

    return (
        <PageLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Campaigns</h1>
                        <p className="text-muted-foreground">
                            Manage fundraising campaigns and donations
                        </p>
                    </div>

                    {/* UPDATED: Dialog Form */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-[#001145]">Create Campaign</DialogTitle>
                                <DialogDescription className="text-[#7088aa]">
                                    Create a new fundraising campaign
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-[#001439]">Campaign Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Immediate Agenda Test"
                                        className="text-[#001439] border-[#dbeaff] placeholder:text-[#a8bdda] focus-visible:ring-[#001145]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="intent" className="text-[#001439]">Intent</Label>
                                    <Input
                                        id="intent"
                                        value={formData.intent}
                                        onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                                        placeholder="Testing"
                                        className="text-[#001439] border-[#dbeaff] placeholder:text-[#a8bdda] focus-visible:ring-[#001145]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-[#001439]">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Testing the 1-minute delay."
                                        rows={3}
                                        className="text-[#001439] border-[#dbeaff] placeholder:text-[#a8bdda] focus-visible:ring-[#001145]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category" className="text-[#001439]">Category (Tag)</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                                        >
                                            <SelectTrigger className="text-[#001439] border-[#dbeaff] focus:ring-[#001145]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-[#dbeaff]">
                                                <SelectItem value="test" className="text-[#001439] focus:bg-[#f6faff] focus:text-[#001145]">Test</SelectItem>
                                                {Object.entries(categoryLabels).map(([value, label]) => (
                                                    <SelectItem key={value} value={value} className="text-[#001439] focus:bg-[#f6faff] focus:text-[#001145]">{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="targetFunds" className="text-[#001439]">Target Funds (₹)</Label>
                                        <Input
                                            id="targetFunds"
                                            type="number"
                                            value={formData.targetFunds}
                                            onChange={(e) => setFormData({ ...formData, targetFunds: e.target.value })}
                                            placeholder="1000"
                                            className="text-[#001439] border-[#dbeaff] placeholder:text-[#a8bdda] focus-visible:ring-[#001145]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="startDate" className="text-[#001439]">Start Date & Time</Label>
                                        <Input
                                            id="startDate"
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="text-[#001439] border-[#dbeaff] placeholder:text-[#a8bdda] focus-visible:ring-[#001145]"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="endDate" className="text-[#001439]">End Date & Time</Label>
                                        <Input
                                            id="endDate"
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            className="text-[#001439] border-[#dbeaff] placeholder:text-[#a8bdda] focus-visible:ring-[#001145]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={
                                        isSaving ||
                                        !formData.title ||
                                        !formData.startDate ||
                                        !formData.endDate ||
                                        !formData.targetFunds
                                    }
                                >
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Campaign
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Analytics Cards - Calculated from Campaigns Data */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">Total Campaigns</span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <Target className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {analytics?.totalCampaigns || 0}
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            {analytics?.activeCampaigns || 0} active
                        </p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">Total Raised</span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <DollarSign className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            ₹{((analytics?.funding?.totalRaised || 0) / 100000).toFixed(1)}L
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            of ₹{((analytics?.funding?.totalTarget || 0) / 100000).toFixed(1)}L target
                        </p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">Supporters</span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <Users className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {analytics?.funding?.totalSupporters || 0}
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">Total contributors</p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">Success Rate</span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <TrendingUp className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {analytics?.successRate || 0}%
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            {analytics?.completedCampaigns || 0} completed
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Campaigns</CardTitle>
                        <CardDescription>View and manage all fundraising campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search campaigns..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.entries(categoryLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="rounded-xl border border-[#dbeaff] overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead className="bg-[#001145] text-white">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                    Campaign
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                    Progress
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                    Timeline
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#e4f0ff] bg-white">
                                            {filteredCampaigns.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-12 text-center text-[#7088aa]">
                                                        No campaigns found
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredCampaigns.map((campaign) => {
                                                    const progress = calculateProgress(
                                                        campaign.financials?.raisedFunds,
                                                        campaign.financials?.targetFunds
                                                    );
                                                    const daysLeft = calculateDaysRemaining(campaign.endDate);
                                                    const category = campaign.tags && campaign.tags.length > 0 ? campaign.tags[0] : 'general';

                                                    return (
                                                        <tr key={campaign._id} className="hover:bg-[#f6f9fe] transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div>
                                                                    <div className="font-bold text-[#001439]">{campaign.title}</div>
                                                                    <div className="text-sm text-[#7088aa] line-clamp-1">
                                                                        {campaign.intent || campaign.description}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#dbeaff] text-[#001145]">
                                                                    {categoryLabels[category] || category}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="space-y-1 min-w-[150px]">
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="text-[#001439]">₹{campaign.financials?.raisedFunds?.toLocaleString() || 0}</span>
                                                                        <span className="text-[#7088aa]">/ ₹{campaign.financials?.targetFunds?.toLocaleString() || 0}</span>
                                                                    </div>
                                                                    <Progress value={progress} className="h-2" />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1 text-sm text-[#001439]">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {campaign.endDate ? format(new Date(campaign.endDate), "MMM d, yyyy") : "N/A"}
                                                                </div>
                                                                {daysLeft > 0 && (
                                                                    <div className="text-xs text-[#7088aa]">{daysLeft} days left</div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant={statusColors[campaign.status] || "default"}>
                                                                    {campaign.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 text-center text-black">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button size="icon">
                                                                            <MoreHorizontal className="h-4 text-black w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem className="text-black" onClick={() => { setSelectedCampaign(campaign); setIsDetailOpen(true); } }>
                                                                            <Eye className="mr-2 text-black h-4 w-4" /> View Details
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-black">
                                                                            <Edit className="mr-2 text-black h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        {campaign.status === "pending" && (
                                                                            <DropdownMenuItem className="text-black" onClick={() => handleVerify(campaign._id)}>
                                                                                <CheckCircle className="mr-2 text-black h-4 w-4" /> Verify & Activate
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem className="text-black" onClick={() => handleDelete(campaign._id)}>
                                                                            <Trash2 className="mr-2 text-black h-4 w-4" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Campaign Detail Dialog */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-[#001439] text-xl">{selectedCampaign?.title}</DialogTitle>
                            <DialogDescription className="text-[#7088aa]">{selectedCampaign?.intent || "No intent specified"}</DialogDescription>
                        </DialogHeader>
                        {selectedCampaign && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#f6faff] p-4 rounded-xl border border-[#e4f0ff]">
                                        <div className="text-2xl font-bold text-[#001439]">
                                            ₹{selectedCampaign.financials?.raisedFunds?.toLocaleString() || 0}
                                        </div>
                                        <p className="text-sm text-[#7088aa]">
                                            raised of ₹{selectedCampaign.financials?.targetFunds?.toLocaleString() || 0}
                                        </p>
                                        <Progress
                                            value={calculateProgress(selectedCampaign.financials?.raisedFunds, selectedCampaign.financials?.targetFunds)}
                                            className="mt-2 h-2"
                                        />
                                    </div>
                                    <div className="bg-[#f6faff] p-4 rounded-xl border border-[#e4f0ff]">
                                        <div className="text-2xl font-bold text-[#001439]">
                                            {selectedCampaign.financials?.donorCount || 0}
                                        </div>
                                        <p className="text-sm text-[#7088aa]">Supporters</p>
                                    </div>
                                    <div className="bg-[#f6faff] p-4 rounded-xl border border-[#e4f0ff]">
                                        <div className="text-2xl font-bold text-[#001439]">
                                            {calculateDaysRemaining(selectedCampaign.endDate)}
                                        </div>
                                        <p className="text-sm text-[#7088aa]">Days Left</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2 text-[#001439]">About this Campaign</h4>
                                    <p className="text-[#7088aa]">{selectedCampaign.description}</p>
                                </div>

                                {selectedCampaign.tags && selectedCampaign.tags.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-[#001439]">Tags</h4>
                                        <div className="flex gap-2">
                                            {selectedCampaign.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-[#dbeaff] text-[#001145] hover:bg-[#dbeaff]/80">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </PageLayout>
    );
}