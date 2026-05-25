"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { LoadingButton } from "@mui/lab";
import { toast } from "sonner";
import { loginSchema, LoginFormValues } from "@/modules/auth/loginSchema";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "chauhansweeta24@gmail.com",
      password: "password123",
    },
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      toast.success("Login successful");
      router.replace("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <ProtectedRoute>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 p-6">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 right-20 h-52 w-52 rounded-full bg-rose-200/50 blur-3xl" />

        <Paper elevation={0} className="relative w-full max-w-md rounded-3xl border border-white/40 bg-white/80 p-7 shadow-xl backdrop-blur-xl">
          <Typography variant="h4" className="!font-black !text-slate-900">
            Welcome Back
          </Typography>
          <Typography variant="body2" className="!mt-1 !text-slate-500">
            Login to manage reminders across Google and Outlook calendars.
          </Typography>

          <Alert severity="info" className="!mt-4">
            Demo credentials: chauhansweeta24@gmail.com / password123
          </Alert>

          <Stack spacing={2} className="mt-5">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                />
              )}
            />

            <LoadingButton loading={isLoading} variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
              Login
            </LoadingButton>
          </Stack>
        </Paper>
      </main>
    </ProtectedRoute>
  );
}
