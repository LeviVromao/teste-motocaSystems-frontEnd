import Header from "@/components/Header";
import Card from "@/components/Card";
import { useEffect, useState } from "react";

type Data = {
  textColor: string;
  backgroundColor: string;
  id?: string;
  color: string;
  model: string;
  value: string;
  status: string;
  code: string;
}

export default function Home() {
  const [items, setItems] = useState<Array<Data> | null>([])

  useEffect(() => {
    const bikeJSON = localStorage.getItem("motorcycles")
    const bikes: Array<Data> | null = bikeJSON ? JSON.parse(bikeJSON) : null;
    setItems(bikes)
  }, [])

  return (
    <main
      className={`bg-backgroundColor`}
    >
      <div >
        <div className={`mb-6`}>
          <Header titleText="Tabela de Motos" searchInput items={items}/>
        </div>
        <Card items={items}/>
      </div>
    </main>
  );
}
