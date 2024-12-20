"use client";

import { useParams } from "next/navigation";

export default function CollectionInfos() {
  const { cardId } = useParams();

  return (
    <div>
      <h1>Aqui vai o id: {cardId}</h1>
    </div>
  );
}
