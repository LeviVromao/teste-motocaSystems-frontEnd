import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  textColor: any;
  backgroundColor: any;
  id?: string;
  color: string;
  model: string;
  value: number;
  status: string;
  code?: string;
};  

const statusColor = {
  redBackground: `bg-[#55304C]`,
  redText: `text-[#FF4C51]`,
  greenBackground: `bg-[#354546]`,
  greenText: `text-[#56CA00]`,
  yellowBackground: `bg-[#544146]`,
  yellowText: `text-[#FFB400]`
}

function formatNumber(num: number) {
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
try {
    const {code, color, value, status, model } = req.body as Data;

    const response = await fetch("http://localhost:3001/bikes");
    const data: Array<Data>= await response.json();
    let currentStatusColorBackground;
    let currentStatusColorText;

    if(status === `Em estoque`) {
      currentStatusColorBackground = statusColor.greenBackground;
      currentStatusColorText = statusColor.greenText;
    } else if(status === `Sem estoque`) {
      currentStatusColorBackground = statusColor.redBackground;
      currentStatusColorText = statusColor.redText;
    } else {
      currentStatusColorBackground = statusColor.yellowBackground;
      currentStatusColorText = statusColor.yellowText;
    }
  
    const bikeToUpdate = data.find(bike => {
      return bike.code === code
    })
    const integerValue = parseInt(`${value}`);
    const updatedData = {
      value: formatNumber(integerValue),
      status,
      color: color.toUpperCase(),
      model: model.toUpperCase(),
      backgroundColor: currentStatusColorBackground,
      textColor: currentStatusColorText,
    }

    if(!bikeToUpdate) {
      return res.status(404).json({message: "A moto nao esta registrada no programa. Verifique os campos."})
    }

    const updatedBike = {...bikeToUpdate, ...updatedData}
    const updateResponse = await fetch(`http://localhost:3001/bikes/${bikeToUpdate.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedBike)
    })

    if(!updateResponse.ok) {
        return res.status(500).json({message: "Erro ao atualizar a moto."})
    }

    const result: Data = await updateResponse.json()
    res.status(202).json({
        message: "Moto atualizada com sucesso", 
        code: result.code, 
        color: result.color, 
        value: result.value, 
        status: result.status, 
        model: result.model,
        id: result.id,
        backgroundColor: result.backgroundColor,
        textColor: result.textColor,
    })
    console.log(result)

} catch (error) {
    res.status(500).json({message: "Erro interno no servidor."})
}
}