import { getDiscussions } from "@/actions/discussion.action";
import { SiteHeader } from "@/components/site-header";
import DiscussionCard from "./discussion-card";
import { MessageSquare, Users, Shield, Info } from "lucide-react";

export default async function DiscussionsPage() {
  const discussions = await getDiscussions();

  return (
    <main>
      <SiteHeader title="Discussions" />

      {/* Introduction Section */}
      <section className="border-b bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Community Discussions</h2>
              <p className="text-muted-foreground leading-relaxed">
                A space for residents to share real-time information, updates,
                and support during disaster events. Connect with your community,
                stay informed, and help others stay safe.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <Users className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Share Information
                </h3>
                <p className="text-xs text-muted-foreground">
                  Report conditions, share updates, and help others in affected
                  zones
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Stay Connected</h3>
                <p className="text-xs text-muted-foreground">
                  Both affected and nearby residents can participate and offer
                  support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Real-time Updates
                </h3>
                <p className="text-xs text-muted-foreground">
                  Get the latest information directly from community members on
                  the ground
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discussions List */}
      <section className="container max-w-4xl mx-auto px-4 py-6">
        {discussions && discussions.length > 0 ? (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <DiscussionCard discussion={discussion} key={discussion.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Active Discussions
            </h3>
            <p className="text-muted-foreground text-sm">
              There are currently no active disaster zone discussions. Check
              back when new zones are reported.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
