import { MdFavoriteBorder } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import Link from "next/link";

// Defina uma interface para as props
interface CardCollectionProps {
  cardId: number | string;
  title: string;
  category: string;
  qtdItems: number | string; // Ajuste o tipo conforme o dado que você recebe
  date: string; // O formato de data que você recebe do banco de dados, geralmente é string
}

export default function CardCollection({
  cardId,
  title,
  category,
  qtdItems,
  date,
}: CardCollectionProps) {
  return (
    <Link href={`/collection/${cardId}`} className="min-w-[300px]">
      <Card className="border hover:border-primary">
        <CardHeader>
          <CardTitle className="flex justify-between">
            {title}{" "}
            <div>
              <MdFavoriteBorder className="text-light" />
            </div>
          </CardTitle>
          <CardDescription>{category}</CardDescription>
        </CardHeader>
        <CardContent className="font-medium">
          <p>{qtdItems}</p>
        </CardContent>
        <CardFooter className="opacity-20">
          <p>{new Date(date).toLocaleDateString()}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
