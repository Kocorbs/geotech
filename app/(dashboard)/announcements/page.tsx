import { SiteHeader } from "@/components/site-header";
import { Phone, AlertCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Hotline {
  name: string;
  number: string;
}

interface HotlineSectionProps {
  title: string;
  hotlines: Hotline[];
  icon: React.ElementType;
}

export default function AnnouncementsPage() {
  const nationalHotlines: Hotline[] = [
    { name: "National Emergency Hotline", number: "911" },
    { name: "NDRRMC Hotline", number: "0917-899-1111" },
    { name: "Philippine Red Cross", number: "143" },
    { name: "Coast Guard", number: "(02) 8527-8481 to 89" },
    { name: "PAGASA Weather", number: "(02) 8927-1335" },
  ];

  const tubodEmergency: Hotline[] = [
    { name: "Tubod Police Station", number: "(063) 341-5028" },
    { name: "Tubod Municipal Hall", number: "(063) 341-5016" },
    { name: "Tubod Rural Health Unit", number: "(063) 341-5017" },
    { name: "Tubod Fire Station", number: "(063) 341-5160" },
    { name: "MDRRMO Tubod", number: "0917-564-2891" },
  ];

  const iliganEmergency: Hotline[] = [
    { name: "Iligan City Police", number: "(063) 221-4444" },
    { name: "Iligan Fire Station", number: "(063) 221-2222" },
    { name: "Iligan City Hospital", number: "(063) 221-6693" },
    { name: "Iligan Medical Center", number: "(063) 221-5227" },
    { name: "CDRRMO Iligan", number: "(063) 221-5444" },
    { name: "Iligan Rescue 911", number: "0917-711-0911" },
  ];

  const HotlineSection = ({
    title,
    hotlines,
    icon: Icon,
  }: HotlineSectionProps) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {hotlines.map((hotline, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg transition-colors"
            >
              <span className="text-foreground font-medium">
                {hotline.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-primary hover:text-primary/80"
              >
                <a href={`tel:${hotline.number.replace(/[^0-9+]/g, "")}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {hotline.number}
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader title="Announcements" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Emergency Alert</AlertTitle>
          <AlertDescription>
            In case of emergency, dial 911 or contact your local emergency
            services immediately. Save these numbers for quick access during
            disasters.
          </AlertDescription>
        </Alert>

        <HotlineSection
          title="National Emergency Hotlines"
          hotlines={nationalHotlines}
          icon={Phone}
        />

        <HotlineSection
          title="Tubod Emergency Contacts"
          hotlines={tubodEmergency}
          icon={MapPin}
        />

        <HotlineSection
          title="Iligan City Emergency Contacts"
          hotlines={iliganEmergency}
          icon={MapPin}
        />

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            Please verify these numbers are current with your local government
            unit. Emergency contact numbers may change without notice.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}
