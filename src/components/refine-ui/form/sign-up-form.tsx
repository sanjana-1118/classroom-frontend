"use client";

import { useState } from "react";
import { LibraryBig } from "lucide-react";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useLink,
  useNotification,
  useRegister,
} from "@refinedev/core";
import { useTheme } from "@/components/refine-ui/theme/theme-provider";
import { useEffect } from "react";

export const SignUpForm = () => {
  const { setForcedTheme } = useTheme();

  useEffect(() => {
    setForcedTheme("light");
    return () => setForcedTheme(undefined);
  }, [setForcedTheme]);

  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { open } = useNotification();

  const Link = useLink();

  const { mutate: register, isPending } = useRegister();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      open?.({
        type: "error",
        message: "Passwords don't match",
        description:
          "Please make sure both password fields contain the same value.",
      });

      return;
    }

    register({
      name,
      email,
      password,
      role,
    });
  };

  const handleSignUpWithGoogle = () => {
    register({
      providerName: "google",
    });
  };

  const handleSignUpWithGitHub = () => {
    register({
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
          <span className="text-sm text-slate-300 hidden sm:inline">Already have an account?</span>
          <Button variant="secondary" className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white border-0" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <div className="auth-shell flex-1">
      <div className="auth-brand">
        <div className="auth-brand-mark"><img src="/logo.jpg" alt="Classroom Logo" className="w-16 h-16 rounded-xl shadow-sm" /></div>
        <p className="auth-kicker">Classroom management</p>
        <h1>Build a better learning rhythm.</h1>
        <p className="auth-brand-copy">Register to organize classes, stay close to announcements, and make every schedule easier to follow.</p>
      </div>

      <Card className="auth-card">
        <CardHeader className={cn("px-0")}>
          <CardTitle
            className={cn(
              "text-3xl font-semibold text-primary"
            )}
          >
            Sign up
          </CardTitle>
          <CardDescription
            className={cn("text-muted-foreground", "font-medium")}
          >
            Create your Classroom management account.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn("px-0")}>
          <form onSubmit={handleSignUp}>
            <div className={cn("flex", "flex-col", "gap-2")}>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div className={cn("flex", "flex-col", "gap-2", "mt-6")}>
              <Label htmlFor="role">Account type</Label>
              <Select value={role} onValueChange={(value) => setRole(value as "student" | "teacher")}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              className={cn("relative", "flex", "flex-col", "gap-2", "mt-6")}
            >
              <Label htmlFor="password">Password</Label>
              <InputPassword
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div
              className={cn("relative", "flex", "flex-col", "gap-2", "mt-6")}
            >
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <InputPassword
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className={cn(
                "w-full",
                "mt-6",
                "bg-primary",
                "hover:bg-primary/90",
                "text-white"
              )}
            >
              {isPending ? "Creating account..." : "Sign up"}
            </Button>

          </form>
        </CardContent>

        <Separator />

        <CardFooter>
          <div className={cn("w-full", "text-center text-sm")}>
            <span className={cn("text-sm", "text-muted-foreground")}>
              Have an account?{" "}
            </span>
            <Link
              to="/login"
              className={cn(
                "text-primary",
                "font-semibold",
                "underline"
              )}
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

SignUpForm.displayName = "SignUpForm";
