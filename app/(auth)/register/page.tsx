import { RegisterForm } from "@/components/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <main className="flex relative min-h-screen flex-col items-center justify-center p-4">
      <img
        src="/weather.svg"
        alt="bg"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Card className="p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl z-50 mx-auto">
        <RegisterForm />
      </Card>
    </main>
  );
}
