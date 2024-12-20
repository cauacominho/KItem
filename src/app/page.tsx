"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Supabase instance
import { ModeToggle } from "@/components/ui/button-theme";
import { useRouter } from "next/navigation";

// Usando o tipo User do Supabase diretamente
import { User as SupabaseUser } from "@supabase/auth-js";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaGear } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";

import { LoaderCircle } from "lucide-react";
import { BiSolidCollection } from "react-icons/bi";
import CollectorCardBuilder from "@/components/CollectorCardBuilder";

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
        <LoaderCircle size={40} className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-light text-3xl font-bold">
            {" "}
            <span className="text-primary">K</span>Item
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/89112946?v=4" />
                  <AvatarFallback>BR</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button
                    variant={"link"}
                    size={"sm"}
                    className="w-full text-light"
                  >
                    <FaUserCircle /> Perfil
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"link"}
                    size={"sm"}
                    className="w-full text-light"
                  >
                    <FaGear /> Configurações
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    className="w-full text-light"
                    onClick={handleLogout}
                  >
                    Sair
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ModeToggle />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="p-4">
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-2xl font-bold">
              <MdFavorite className="mr-1 text-red-700" /> Favoritos
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-3 md:gap-4 overflow-x-auto space-x-4 md:space-x-0 md:space-y-0 flex-row">
            <CollectorCardBuilder />
          </div>
        </section>
        <section className="mb-5">
          <div className="flex justify-between items-center md:inline-block mb-4">
            <div className="flex items-center text-2xl font-bold">
              <BiSolidCollection className="mr-1 text-primary" /> Minhas
              coleções
            </div>
            <div>
              <a
                className="flex items-center font-medium hover:underline"
                href=""
              >
                Ver mais
              </a>
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-3 md:gap-4 overflow-x-auto space-x-4 md:space-x-0 md:space-y-0 flex-row">
            <CollectorCardBuilder />
          </div>
        </section>
      </div>
    </>
  );
}
