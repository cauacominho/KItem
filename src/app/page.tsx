"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Supabase instance
import { ModeToggle } from "@/components/ui/button-theme";
import { useRouter } from "next/navigation";

// Usando o tipo User do Supabase diretamente
import { User as SupabaseUser } from "@supabase/auth-js";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [user, setUser] = useState<SupabaseUser | null>(null); // Tipando o estado do usuário como 'SupabaseUser' ou 'null'
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null); // Atualiza o estado do usuário
      setLoading(false); // Marca como carregado
    };

    checkUser();

    // Subscribing to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null); // Atualiza o estado com o usuário logado
        setLoading(false);
      }
    );

    // Corrigido: Desinscrevendo corretamente ao desmontar o componente
    return () => {
      authListener?.subscription.unsubscribe(); // Acesse a propriedade 'subscription' e chame 'unsubscribe'
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Realiza o logout
    router.push("/auth/login"); // Redireciona para a página de login
  };

  // Redireciona para a página de login se o usuário não estiver logado, mas só depois de carregar
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/auth/login");
    }
  }, [user, loading, router]); // Só roda esse efeito quando o usuário mudar e a carga estiver completa

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg
          className="animate-spin h-12 w-12 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0c-5.523 0-10 4.477-10 10h2z"
          />
        </svg>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <ModeToggle />
      <h1>Bem-vindo, {user?.email ?? "Usuário"}</h1>
      {/* Aqui pode ir mais conteúdo que deve ser visível apenas para usuários logados */}
      <div className="mt-10">
        <Button className="bg-destructive text-light" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  );
}
