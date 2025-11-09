import { getDiscussionById } from "@/actions/discussion.action";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Flame,
  Waves,
  Mountain,
  Wind,
  MessageSquare,
  Users,
  Calendar,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentForm } from "./comment-form";

const getDisasterIcon = (type: string) => {
  switch (type) {
    case "FLOOD":
      return <Waves className="w-6 h-6" />;
    case "FIRE":
      return <Flame className="w-6 h-6" />;
    case "EARTHQUAKE":
      return <Mountain className="w-6 h-6" />;
    case "LANDSLIDE":
      return <Mountain className="w-6 h-6" />;
    case "TYPHOON":
      return <Wind className="w-6 h-6" />;
    default:
      return <AlertTriangle className="w-6 h-6" />;
  }
};

const getDangerLevelStyle = (level: string) => {
  switch (level) {
    case "HIGH":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "MEDIUM":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-500 border-orange-500/20";
    case "LOW":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getDisasterColor = (type: string) => {
  switch (type) {
    case "FLOOD":
      return "bg-blue-500";
    case "FIRE":
      return "bg-destructive";
    case "EARTHQUAKE":
      return "bg-slate-600";
    case "LANDSLIDE":
      return "bg-amber-600";
    case "TYPHOON":
      return "bg-cyan-500";
    default:
      return "bg-muted-foreground";
  }
};

export default async function DiscussionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discussion = await getDiscussionById(Number(id));

  if (!discussion) {
    return (
      <main>
        <SiteHeader title="Discussion Not Found" />
        <div className="container max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            This discussion could not be found.
          </p>
        </div>
      </main>
    );
  }

 const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // optional: show AM/PM
    timeZone: "Asia/Manila", // ✅ Force PH timezone
  });
};

  const netVotes = discussion.upvotes - discussion.downvotes;

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader title={discussion.zone.name} />

      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Zone Information Card */}
        <Card
          className="border-l-4"
          style={{
            borderLeftColor: getDisasterColor(
              discussion.zone.disasterType
            ).replace("bg-", "#"),
          }}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`p-3 rounded-lg ${getDisasterColor(
                    discussion.zone.disasterType
                  )} text-primary-foreground`}
                >
                  {getDisasterIcon(discussion.zone.disasterType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">
                      {discussion.zone.name}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDangerLevelStyle(
                        discussion.zone.dangerLevel
                      )}`}
                    >
                      {discussion.zone.dangerLevel}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        discussion.zone.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-600 dark:text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {discussion.zone.status}
                    </span>
                  </div>
                  {discussion.zone.description &&
                    discussion.zone.description !== "undefined" && (
                      <p className="text-muted-foreground">
                        {discussion.zone.description}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Affected</p>
                  <p className="font-semibold">
                    {discussion.zone.affectedUserLocations.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Feedbacks</p>
                  <p className="font-semibold">{discussion.comments.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Active Since</p>
                  <p className="font-medium text-xs">
                    {formatDate(discussion.zone.dateActive)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Votes</p>
                  <p
                    className={`font-semibold ${
                      netVotes >= 0
                        ? "text-green-600 dark:text-green-500"
                        : "text-destructive"
                    }`}
                  >
                    {netVotes >= 0 ? "+" : ""}
                    {netVotes}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discussion Content */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussion
            </h2>
          </CardHeader>
          <CardContent>
            {discussion.content && discussion.content.includes("undefined") ? (
              <p className="text-muted-foreground italic">
                Share updates, ask questions, and connect with others affected
                by this {discussion.zone.disasterType.toLowerCase()} event.
              </p>
            ) : (
              <p className="text-foreground">{discussion.content}</p>
            )}

            <Separator className="my-4" />

            {/* Voting Section */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Upvote ({discussion.upvotes})
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingDown className="w-4 h-4" />
                Downvote ({discussion.downvotes})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Feedbacks ({discussion.comments.length})
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {discussion.comments.length > 0 ? (
              discussion.comments.map((comment) => {
                // Check if user is affected by checking if their location is in affectedUserLocations
                const isAffected = discussion.zone.affectedUserLocations.some(
                  (affected) =>
                    affected.userLocation.userId === comment.authorId
                );

                return (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-4 rounded-lg bg-muted/50"
                  >
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">
                          {comment.author.firstName} {comment.author.lastName}
                        </span>
                        {isAffected ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                            Affected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20">
                            Not Affected
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No feedbacks yet. Be the first to share information!
                </p>
              </div>
            )}

            <Separator className="my-4" />

            {/* Comment Form */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Add a Comment</h3>
              <CommentForm discussionId={discussion.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
