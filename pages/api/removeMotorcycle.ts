import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
try {
    const {code, id} = req.body
    const response = await fetch(`http://localhost:3001/bikes/${id}`, {
      method: "DELETE"
    })

    if(!response.ok) {
        res.status(500).json({message: "Ocorreu um erro ao excluir moto"})
        return;
    }  
    res.status(202).json({message: `Moto com o codigo ${code} excluida com sucesso!`})
} catch (error) {
    res.status(500).json({message: "Erro interno no servidor."})
}
}