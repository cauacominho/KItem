"use client";

import { useEffect, useState } from "react";
import CardCollection from "./ui/card-collection";
import { supabase } from "../lib/supabase";

interface Collection {
  id: number;
  name: string;
  category: string;
  user_id: string;
  created_at: string;
}

export default function CollectorCardBuilder() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase.from("collections").select("*"); // Selecionando apenas a coluna 'name'

      if (error) {
        console.error("Erro ao buscar dados:", error.message);
      }

      if (data && data.length > 0) {
        setCollections(data as Collection[]);
      } else {
        console.log("Nenhum dado encontrado.");
      }
    };

    fetchCollections();
  }, []);

  return (
    <>
      {collections.map((collection) => (
        <CardCollection
          key={collection.id}
          cardId={collection.id}
          title={collection.name}
          category={collection.category}
          qtdItems={collection.user_id}
          date={collection.created_at}
        />
      ))}
    </>
  );
}
