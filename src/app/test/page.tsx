"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase";

export default function TestPage() {
  const fetchData = async () => {
    const { data, error } = await supabase.from("test_table").select("*");

    if (error) {
      console.error("Erro ao conectar com o Supabase:", error);
      return alert("Erro na conexão: " + error.message);
    }

    console.log("Dados recebidos do Supabase:", data);
    alert("Conexão bem-sucedida! Confira os dados no console.");
  };

  return (
    <div>
      <h1>Teste de Conexão com Supabase</h1>
      <Button onClick={fetchData}>Testar Conexão</Button>
    </div>
  );
}
