"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // Importando a configuração do Supabase
import { Button } from "@/components/ui/button"; // Componente de Button do ShadCN
import { Input } from "@/components/ui/input"; // Componente de Input do ShadCN
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Verifica se o usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        // Redireciona para a home caso o usuário esteja logado
        router.push("/");
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
      // Redirecionar para a página inicial ou onde você quiser
      router.push("/");
    }
  };

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
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 p-2 w-full border rounded-md bg-input text-foreground"
              />
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
