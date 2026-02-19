import Link from "next/link";
import { AlertCircle, Link2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function KingsChatNotLinkedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-amber-600" />
          </div>
          <CardTitle className="text-xl">No account linked</CardTitle>
          <CardDescription className="text-base">
            The KingsChat account you signed in with is not connected to any
            VGSS account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">What you can do:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sign in with your username and password.</li>
              <li>
                Go to <span className="font-medium">Settings → Connected accounts</span>.
              </li>
              <li>Click <span className="font-medium">Connect KingsChat</span> to link your account.</li>
            </ol>
            <p className="pt-1">
              After linking, you can sign in with KingsChat going forward.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in with username &amp; password
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">
                Back to login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
