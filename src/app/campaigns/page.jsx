"use client";

import * as React from "react";
import { format } from "date-fns";
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
    other: "Other",
};

const statusColors = {
    draft: "secondary",
    pending: "outline",
    active: "default",
    completed: "default",
    cancelled: "destructive",
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
    const [analytics, setAnalytics] = React.useState(null);

    const [formData, setFormData] = React.useState({
        title: "",
        tagline: "",
        description: "",
        category: "general",
        targetAmount: 0,
        startDate: "",
        endDate: "",
        beneficiaries: "",
        expectedOutcomes: [],
    });

    const fetchCampaigns = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const params = {};
            if (statusFilter !== "all") params.status = statusFilter;
            if (categoryFilter !== "all") params.category = categoryFilter;

            const response = await campaignsApi.getAll(params);
            setCampaigns(response.data.data?.campaigns || []);
        } catch {
            toast({
                title: "Error",
                description: "Failed to fetch campaigns",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, categoryFilter, toast]);

    const fetchAnalytics = React.useCallback(async () => {
        try {
            const response = await campaignsApi.getAnalytics();
            setAnalytics(response.data?.data || analytics);
        } catch {
            // Silently fail for analytics
        }
    }, []);

    React.useEffect(() => {
        fetchCampaigns();
        fetchAnalytics();
    }, [fetchCampaigns, fetchAnalytics]);

    const handleCreate = async () => {
        try {
            setIsSaving(true);
            await campaignsApi.create(formData);
            toast({
                title: "Success",
                description: "Campaign created successfully",
            });
            setIsDialogOpen(false);
            resetForm();
            fetchCampaigns();
            fetchAnalytics();
        } catch {
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
            toast({
                title: "Success",
                description: "Campaign verified and activated",
            });
            fetchCampaigns();
            fetchAnalytics();
        } catch {
            toast({
                title: "Error",
                description: "Failed to verify campaign",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this campaign?")) return;
        try {
            await campaignsApi.delete(id);
            toast({ title: "Success", description: "Campaign deleted" });
            fetchCampaigns();
            fetchAnalytics();
        } catch {
            toast({
                title: "Error",
                description: "Failed to delete campaign",
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            tagline: "",
            description: "",
            category: "general",
            targetAmount: 0,
            startDate: "",
            endDate: "",
            beneficiaries: "",
            expectedOutcomes: [],
        });
    };

    const filteredCampaigns = campaigns.filter(
        (c) =>
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
    );

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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create Campaign</DialogTitle>
                                <DialogDescription>
                                    Create a new fundraising campaign
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">
                                        Campaign Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Enter campaign title"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tagline">Tagline</Label>
                                    <Input
                                        id="tagline"
                                        value={formData.tagline}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tagline: e.target.value,
                                            })
                                        }
                                        placeholder="Short tagline for the campaign"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Detailed description of the campaign"
                                        rows={4}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    category: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(
                                                    categoryLabels
                                                ).map(([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="targetAmount">
                                            Target Amount (₹)
                                        </Label>
                                        <Input
                                            id="targetAmount"
                                            type="number"
                                            value={formData.targetAmount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    targetAmount:
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0,
                                                })
                                            }
                                            placeholder="100000"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="startDate">
                                            Start Date
                                        </Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    startDate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="endDate">
                                            End Date
                                        </Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    endDate: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="beneficiaries">
                                        Beneficiaries
                                    </Label>
                                    <Textarea
                                        id="beneficiaries"
                                        value={formData.beneficiaries}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                beneficiaries: e.target.value,
                                            })
                                        }
                                        placeholder="Who will benefit from this campaign?"
                                        rows={2}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreate}
                                    disabled={
                                        isSaving ||
                                        !formData.title ||
                                        !formData.description ||
                                        !formData.startDate ||
                                        !formData.endDate ||
                                        formData.targetAmount <= 0
                                    }
                                >
                                    {isSaving && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create Campaign
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Analytics Cards - Sarthak Theme */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Total Campaigns
                            </span>
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
                            <span className="text-[#7088aa] text-sm font-medium">
                                Total Raised
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <DollarSign className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            ₹
                            {(
                                (analytics?.funding?.totalRaised || 0) / 100000
                            ).toFixed(1)}
                            L
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            of ₹
                            {(
                                (analytics?.funding?.totalTarget || 0) / 100000
                            ).toFixed(1)}
                            L target
                        </p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Supporters
                            </span>
                            <div className="p-2 bg-[#e4f0ff] rounded-xl">
                                <Users className="h-4 w-4 text-[#4a5f7c]" />
                            </div>
                        </div>
                        <p className="text-4xl font-extrabold text-[#001145]">
                            {analytics?.funding?.totalSupporters || 0}
                        </p>
                        <p className="text-[#7088aa] text-sm mt-1">
                            Total contributors
                        </p>
                    </div>
                    <div className="bg-[#f6faff] rounded-2xl p-6 border border-[#e4f0ff]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#7088aa] text-sm font-medium">
                                Success Rate
                            </span>
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
                        <CardDescription>
                            View and manage all fundraising campaigns
                        </CardDescription>
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
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Categories
                                    </SelectItem>
                                    {Object.entries(categoryLabels).map(
                                        ([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Timeline</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-20">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCampaigns.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No campaigns found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredCampaigns.map((campaign) => (
                                            <TableRow key={campaign._id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {campaign.title}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                                            {campaign.tagline ||
                                                                campaign.description}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {categoryLabels[
                                                            campaign.category
                                                        ] || campaign.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span>
                                                                ₹
                                                                {campaign.raisedAmount?.toLocaleString()}
                                                            </span>
                                                            <span className="text-muted-foreground">
                                                                / ₹
                                                                {campaign.targetAmount?.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={
                                                                campaign.progress ||
                                                                0
                                                            }
                                                            className="h-2"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Calendar className="h-3 w-3" />
                                                        {campaign.endDate
                                                            ? format(
                                                                  new Date(
                                                                      campaign.endDate
                                                                  ),
                                                                  "MMM d, yyyy"
                                                              )
                                                            : "N/A"}
                                                    </div>
                                                    {campaign.daysRemaining !==
                                                        undefined &&
                                                        campaign.daysRemaining >
                                                            0 && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {
                                                                    campaign.daysRemaining
                                                                }{" "}
                                                                days left
                                                            </div>
                                                        )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            statusColors[
                                                                campaign.status
                                                            ]
                                                        }
                                                    >
                                                        {campaign.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedCampaign(
                                                                        campaign
                                                                    );
                                                                    setIsDetailOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            {campaign.status ===
                                                                "pending" && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleVerify(
                                                                            campaign._id
                                                                        )
                                                                    }
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Verify &
                                                                    Activate
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        campaign._id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Campaign Detail Dialog */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{selectedCampaign?.title}</DialogTitle>
                            <DialogDescription>
                                {selectedCampaign?.tagline}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedCampaign && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="pt-4">
                                            <div className="text-2xl font-bold">
                                                ₹
                                                {selectedCampaign.raisedAmount?.toLocaleString()}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                raised of ₹
                                                {selectedCampaign.targetAmount?.toLocaleString()}
                                            </p>
                                            <Progress
                                                value={
                                                    selectedCampaign.progress ||
                                                    0
                                                }
                                                className="mt-2"
                                            />
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-4">
                                            <div className="text-2xl font-bold">
                                                {
                                                    selectedCampaign.supportersCount
                                                }
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Supporters
                                            </p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-4">
                                            <div className="text-2xl font-bold">
                                                {selectedCampaign.daysRemaining ||
                                                    0}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Days Left
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">
                                        About this Campaign
                                    </h4>
                                    <p className="text-muted-foreground">
                                        {selectedCampaign.description}
                                    </p>
                                </div>

                                {selectedCampaign.beneficiaries && (
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Beneficiaries
                                        </h4>
                                        <p className="text-muted-foreground">
                                            {selectedCampaign.beneficiaries}
                                        </p>
                                    </div>
                                )}

                                {selectedCampaign.expectedOutcomes?.length >
                                    0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Expected Outcomes
                                        </h4>
                                        <ul className="list-disc list-inside text-muted-foreground">
                                            {selectedCampaign.expectedOutcomes.map(
                                                (outcome, i) => (
                                                    <li key={i}>{outcome}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {selectedCampaign.milestones?.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            Milestones
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedCampaign.milestones.map(
                                                (milestone, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div
                                                            className={`w-3 h-3 rounded-full ${
                                                                milestone.isCompleted
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-300"
                                                            }`}
                                                        />
                                                        <span
                                                            className={
                                                                milestone.isCompleted
                                                                    ? "line-through text-muted-foreground"
                                                                    : ""
                                                            }
                                                        >
                                                            {milestone.title}
                                                        </span>
                                                    </div>
                                                )
                                            )}
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
