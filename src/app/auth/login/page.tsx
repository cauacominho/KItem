"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { LoaderCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar entre mostrar/ocultar senha
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 border-none shadow-none sm:border sm:border-gray-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Entrar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 p-2 w-full border rounded-md bg-input text-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-foreground"
              >
                Senha
              </label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"} // Altera o tipo para texto ou senha
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-md bg-input text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)} // Alterna o estado do botão
                  className="absolute inset-y-0 right-2 flex items-center text-secondary-foreground"
                >
                  {showPassword ? (
                    <VscEye size={20} />
                  ) : (
                    <VscEyeClosed size={20} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-sm font-medium">{error}</p>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <div className="text-center mt-5">
              Ainda não tem conta?{" "}
              <a className="text-primary font-bold" href="/auth/signup">
                {" "}
                Crie uma
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
