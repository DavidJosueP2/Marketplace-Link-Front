import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/shadcn/tabs";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import ProfileAccountTab from "./profile/ProfileAccountTab";
import ProfilePersonalTab from "./profile/ProfilePersonalTab";
import ProfileSecurityTab from "./profile/ProfileSecurityTab";

interface MarketplaceContext {
  theme: "light" | "dark";
}

export default function Profile() {
  const { profile, loading, updating, errors, activeTab, setActiveTab, updateProfile, changePassword, clearFieldError } = useProfile();
  const context = useOutletContext<MarketplaceContext>();
  const theme = context?.theme || "light";

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No se pudo cargar el perfil
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Mi Perfil</CardTitle>
          <p className="text-sm text-muted-foreground">
            Administra tu información personal y configuración de cuenta
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Cuenta</TabsTrigger>
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6">
              <ProfileAccountTab
                profile={profile}
                updating={updating}
                onUpdate={updateProfile}
                theme={theme}
                errors={errors}
                clearFieldError={clearFieldError}
              />
            </TabsContent>

            <TabsContent value="personal" className="mt-6">
              <ProfilePersonalTab
                profile={profile}
                updating={updating}
                onUpdate={updateProfile}
                theme={theme}
                errors={errors}
                clearFieldError={clearFieldError}
              />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <ProfileSecurityTab
                updating={updating}
                onChangePassword={changePassword}
                theme={theme}
                errors={errors}
                clearFieldError={clearFieldError}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
