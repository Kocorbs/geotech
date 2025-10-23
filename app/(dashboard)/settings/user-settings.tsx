import { auth } from "@/auth";
import { UpdateUserForm } from "./update-user-form";
import { UpdatePasswordForm } from "./update-password-form";
import { getUser } from "@/actions/user.action";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UpdatePhoneNumberForm } from "./update-phoneNumber-form";

export default async function UserSettings() {
  const session = await auth();

  if (!session) return null;

  const user = await getUser(session.user.id);
  if (!user) return null;

  return (
    <section className="min-h-screen bg-background py-12 px-6 md:px-20">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Profile Update */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Phone Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdatePhoneNumberForm
              userId={user.id}
              defaultValues={{ phoneNumber: user.phoneNumber || "" }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateUserForm
              userId={session.user.id}
              defaultValues={{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }}
            />
          </CardContent>
        </Card>

        {/* Password Update */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdatePasswordForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
