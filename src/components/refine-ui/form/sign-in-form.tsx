"use client";

import { useState } from "react";

import { CircleHelp, LibraryBig } from "lucide-react";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLink, useLogin } from "@refinedev/core";
import { useTheme } from "@/components/refine-ui/theme/theme-provider";
import { useEffect } from "react";

export const SignInForm = () => {
  const { setForcedTheme } = useTheme();

  useEffect(() => {
    setForcedTheme("light");
    return () => setForcedTheme(undefined);
  }, [setForcedTheme]);

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Link = useLink();

  const { mutate: login } = useLogin();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({
      email,
      password,
    });
  };

  const handleSignInWithGoogle = () => {
    login({
      providerName: "google",
    });
  };

  const handleSignInWithGitHub = () => {
    login({
      providerName: "github",
    });
  };

  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Dark Blue Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-6 lg:px-[8vw] z-10 shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <img src="/logo.jpg" alt="Classroom Logo" className="size-6 rounded-sm" />
          <span>Classroom</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 hidden sm:inline">New to Classroom?</span>
          <Button variant="secondary" className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white border-0" size="sm" asChild>
            <Link to="/register">Sign up</Link>
          </Button>
        </div>
      </header>

      <div className="auth-shell flex-1">
      <div className="auth-brand">
        <div className="auth-brand-mark"><img src="/logo.jpg" alt="Classroom Logo" className="w-16 h-16 rounded-xl shadow-sm" /></div>
        <p className="auth-kicker">Classroom management</p>
        <h1>Keep every class moving.</h1>
        <p className="auth-brand-copy">One calm workspace for departments, subjects, schedules, students, and announcements.</p>
      </div>

      <Card className="auth-card">
        <CardHeader className={cn("px-0")}>
          <CardTitle
            className={cn(
                "text-3xl font-semibold text-primary"
            )}
          >
            Sign in
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Sign in to your Classroom workspace.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0")}>
          <form onSubmit={handleSignIn}>
            <div className={cn("flex", "flex-col", "gap-2")}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              className={cn("relative", "flex", "flex-col", "gap-2", "mt-6")}
            >
              <Label htmlFor="password">Password</Label>
              <InputPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div
              className={cn(
                "flex items-center justify-between",
                "flex-wrap",
                "gap-2",
                "mt-4"
              )}
            >
              <div className={cn("flex items-center", "space-x-2")}>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked === "indeterminate" ? false : checked)
                  }
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link
                to="/forgot-password"
                className={cn(
                  "text-sm",
                  "flex",
                  "items-center",
                  "gap-2",
                  "text-primary hover:underline",
                  "text-primary"
                )}
              >
                <span>Forgot password</span>
                <CircleHelp className={cn("w-4", "h-4")} />
              </Link>
            </div>

            <Button type="submit" size="lg" className={cn("w-full", "mt-6")}>
              Sign in
            </Button>
          </form>
        </CardContent>

        <Separator />

        <CardFooter>
          <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              No account?{" "}
            </span>
            <Link
              to="/register"
              className={cn(
                "text-primary",
                "font-semibold",
                "underline"
              )}
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

SignInForm.displayName = "SignInForm";
