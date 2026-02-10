import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";
import { organizationService } from "@/infrastructure/api/organization.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Badge } from "@/presentation/components/ui/badge";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/components/ui/alert-dialog";
import {
  Building2,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/presentation/stores/authStore";

interface OrganizationViewProps {
  organization: Organization | null;
}

const OrganizationView = ({
  organization: initialOrganization,
}: OrganizationViewProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [organization, setOrganization] = useState(initialOrganization);

  if (!organization) {
    return null;
  }
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    domain: organization.domain,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: organization.name,
      domain: organization.domain,
    });
    setError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await organizationService.updateOrganization(
        organization._id,
        formData,
      );
      setOrganization(updated);
      setIsEditing(false);
      setSuccess("Organization updated successfully");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await organizationService.deleteOrganization(organization._id);

      // Logout user after deleting organization
      logout();
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete organization");
      setShowDeleteDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organization</h2>
          <p className="text-muted-foreground">
            Manage your organization settings
          </p>
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your organization information"
              : "Information about your organization"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="acme.com"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-medium">{organization.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Domain</p>
                <p className="text-lg font-medium">{organization.domain}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organization ID</p>
                <p className="text-sm font-mono">{organization._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={organization.isActive ? "default" : "secondary"}
                >
                  {organization.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this organization? This action
              cannot be undone. All users associated with this organization will
              be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizationView;
