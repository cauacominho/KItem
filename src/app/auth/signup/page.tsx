"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; // Importando a configuração do Supabase
import { Button } from "@/components/ui/button"; // Componente de Button do ShadCN
import { Input } from "@/components/ui/input"; // Componente de Input do ShadCN
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Importando os componentes do Card do ShadCN
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { LoaderCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        // Redireciona para a home caso o usuário esteja logado
        router.push("/");
      } else {
        // Conclui o carregamento
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage(
        "Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta."
      );
      setError("");

      // Redireciona o usuário para a página de login após o cadastro
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000); // Exibe a mensagem de sucesso por 3 segundos antes do redirecionamento
    }
  };

  if (loading) {
    // Exibe um indicador de carregamento enquanto verifica a autenticação
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle size={40} className="animate-spin" />
      </div>
    );
  }

  // Renderiza o formulário apenas quando não está carregando
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 border-none shadow-none sm:border sm:border-gray-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Criar Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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

            {successMessage && (
              <p className="text-success text-sm font-medium">
                {successMessage}
              </p>
            )}

            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
            <div className="text-center mt-5">
              Já tem conta?{" "}
              <a className="text-primary font-bold" href="/auth/login">
                {" "}
                Entrar
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
