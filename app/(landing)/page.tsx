import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Shield,
  Bell,
  Zap,
  Eye,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      {/* Header */}
      <nav className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold">GeoTech</span>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit">
                <Zap className="h-3 w-3 mr-2" />
                Real-time Monitoring
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Protect Your Home with Smart GIS Technology
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Monitor dangerous weather conditions and geographical hazards in
                real-time. Get instant alerts when your location is at risk and
                stay one step ahead of nature.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              >
                Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </div>

            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Live Alert Example:</strong> Flood risk detected 2.3km
                from your location. Expected impact in 45 minutes.
              </AlertDescription>
            </Alert>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card border rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Live Dashboard</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      Active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Safety Status</p>
                          <p className="text-2xl font-bold text-green-500">
                            Safe
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Monitoring</p>
                          <p className="text-2xl font-bold text-blue-500">
                            24/7
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Weather Station Alpha</span>
                    </div>
                    <Badge variant="secondary">Normal</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">Flood Zone Beta</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-amber-500 text-amber-600"
                    >
                      Watch
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Your Location</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    >
                      Protected
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-background/30">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-4xl font-bold">Advanced GIS Protection</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive monitoring and alert system powered by cutting-edge
            geographic information technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Real-time GIS Mapping</CardTitle>
              <CardDescription>
                Interactive maps showing live weather conditions, flood zones,
                and hazard areas with precise location tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Automatic Alerts</CardTitle>
              <CardDescription>
                Instant notifications when dangerous conditions threaten your
                home, with severity levels and recommended actions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Danger Zone Detection</CardTitle>
              <CardDescription>
                Advanced algorithms identify high-risk areas and assess impact
                probability for your specific location
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>24/7 Monitoring</CardTitle>
              <CardDescription>
                Continuous surveillance of weather patterns, geological
                conditions, and environmental hazards in your area
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Multi-Location Support</CardTitle>
              <CardDescription>
                Monitor multiple properties, family locations, and points of
                interest from a single dashboard
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle>Smart Predictions</CardTitle>
              <CardDescription>
                AI-powered forecasting predicts potential hazards hours or days
                in advance for better preparation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-4xl font-bold">
            Simple Setup, Powerful Protection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our streamlined onboarding process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold">Add Your Location</h3>
            <p className="text-muted-foreground">
              Enter your address and well immediately start monitoring weather
              and geological conditions in your area
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold">Set Alert Preferences</h3>
            <p className="text-muted-foreground">
              Choose which types of hazards to monitor and how you want to be
              notified when risks are detected
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold">Stay Protected</h3>
            <p className="text-muted-foreground">
              Receive real-time alerts and access detailed maps showing exactly
              how conditions affect your location
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-600/10">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Start Protecting Your Home Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who trust GeoTech to keep their families and
            properties safe
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-12 py-6"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Free 14-day trial
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">GeoTech</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 GeoTech. Protecting homes with smart technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
