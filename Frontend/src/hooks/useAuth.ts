import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/api/auth.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export function useLogin() {
  const loginStore = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  return useMutation({
    mutationFn: (data: any) => authService.login(data),
    onSuccess: (data) => {
      loginStore(data.access_token);
      toast.success("Welcome back, Chef!");
      router.push(redirect);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Login failed. Please verify credentials.";
      toast.error(message);
    },
  });
}

export function useRegister() {
  const loginStore = useAuthStore((state) => state.login);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: (data) => {
      if (data.access_token) {
        loginStore(data.access_token);
        toast.success("Welcome to BiteBot!");
        router.push("/dashboard");
      } else {
        toast.success("Registration successful! Please sign in.");
        router.push("/login");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
}
