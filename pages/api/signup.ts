import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

type Data = {
  id?: string;
  color: string;
  model: string;
  value: number;
  status: string;
  code: string;
};

const statusColor = {
  redBackground: `bg-[#55304C]`,
  redText: `text-[#FF4C51]`,
  greenBackground: `bg-[#354546]`,
  greenText: `text-[#56CA00]`,
  yellowBackground: `bg-[#544146]`,
  yellowText: `text-[#FFB400]`
};

function formatNumber(num: number) {
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code, color, value, status, model } = req.body as Data;
    const id = uuidv4();
    const integerValue = parseInt(`${value}`, 10);
    let currentStatusColorBackground;
    let currentStatusColorText;

    if (status === `Em estoque`) {
      currentStatusColorBackground = statusColor.greenBackground;
      currentStatusColorText = statusColor.greenText;
    } else if (status === `Sem estoque`) {
      currentStatusColorBackground = statusColor.redBackground;
      currentStatusColorText = statusColor.redText;
    } else {
      currentStatusColorBackground = statusColor.yellowBackground;
      currentStatusColorText = statusColor.yellowText;
    }

    const formatedData = {
      id,
      code,
      color: color.toUpperCase(),
      model: model.toUpperCase(),
      value: formatNumber(integerValue),
      status,
      backgroundColor: currentStatusColorBackground,
      textColor: currentStatusColorText,
    };

    const response = await fetch("https://teste-motoca-systems-front-end-levi.vercel.app/bikes");
    const data: Array<Data> = await response.json();

    const alreadyExist = data.find(bike => bike.code === formatedData.code);

    if (!alreadyExist) {
      await fetch("http://localhost:3001/bikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formatedData)
      });

      res.status(202).json({ formatedData, message: "Moto registrada com sucesso" });
    } else {
      res.status(409).json({message: "Moto ja registrada no sistema."})
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
}
