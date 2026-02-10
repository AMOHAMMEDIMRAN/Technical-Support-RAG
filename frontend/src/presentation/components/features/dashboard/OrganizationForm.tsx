import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { organizationService } from "@/infrastructure/api/organization.service";
import type { Organization } from "@/core/domain/types";
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
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { Building2, AlertCircle, CheckCircle } from "lucide-react";

interface OrganizationFormProps {
  onSuccess?: (organization: Organization) => void;
}

const OrganizationForm = ({ onSuccess }: OrganizationFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newOrg = await organizationService.createOrganization(formData);
      setSuccess(true);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(newOrg);
      } else {
        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          navigate({ to: "/dashboard" });
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to create organization. Please try again.",
      );
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

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            <CardTitle>Organization Created!</CardTitle>
          </div>
          <CardDescription>
            Your organization has been successfully created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Redirecting to dashboard...
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-sm text-muted-foreground">
                {formData.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Domain:</span>
              <span className="text-sm text-muted-foreground">
                {formData.domain}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Create Your Organization</CardTitle>
            <CardDescription>
              Set up your organization to start managing users and access
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Acme Corporation"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              The name of your company or organization
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              name="domain"
              placeholder="acme.com"
              value={formData.domain}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Your organization's email domain (e.g., company.com)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrganizationForm;
