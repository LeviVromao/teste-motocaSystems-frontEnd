import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

type Data = {
  backgroundColor: any;
  textColor: any;
  id?: string;
  color: string;
  model: string;
  value: string;
  status: string;
  code: string;
  message: string
}

export default function Edit(){  
  const { query } = useRouter();
  const [motorcycleModel, setMotorcycleModel] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const code = `#${query.id}`
    const bikeJSON = localStorage.getItem('motorcycles');
    const bikes: Array<Data> | null = bikeJSON ? JSON.parse(bikeJSON) : null;
    const codeWithoutAsterisk = code.replace(/#/gi, "")
    const mainDiv = document.querySelector('.main') as HTMLDivElement
    const span = document.createElement('span') as HTMLSpanElement

    span.style.position = 'absolute'
    span.style.display = 'flex'
    span.style.alignItems = 'center'
    span.style.left = '4%'
    span.style.top = '4%'
    span.style.fontWeight = '700'
    span.style.padding = '0.875rem'
    span.style.height = "3rem"
    span.style.borderRadius = '8px'

    const motorcycleExists = bikes?.some(bike => {
      return code === bike.code
    })

    if(!status) {
      span.style.color = '#FF4C51'
      span.style.background = '#55304C'
      span.style.border = '2px solid #55304C'
      span.textContent = "Você precisa escolher uma opção de status."
      mainDiv.appendChild(span)
      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)
      return;

    } else if(isNaN(parseFloat(value))) {
      span.style.color = '#FF4C51'
      span.style.background = '#55304C'
      span.style.border = '2px solid #55304C'
      span.textContent = "O valor da moto precisa ser um número."
      mainDiv.appendChild(span)
      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)
      return;

    } else if(isNaN(parseInt(codeWithoutAsterisk)) || code.length !== 5 || code.indexOf("#") !== 0) {
      span.style.color = '#FF4C51'
      span.style.background = '#55304C'
      span.style.border = '2px solid #55304C'
      span.textContent = "O codigo precisa ser um numero de 4 digitos com asterisco no inicio"
      mainDiv.appendChild(span)
      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)
      return;

    } else if(!isNaN(parseInt(color)) || !isNaN(parseInt(motorcycleModel))) {  
      span.style.color = '#FF4C51'
      span.style.background = '#55304C'
      span.style.border = '2px solid #55304C'
      span.textContent = "A cor ou modelo da moto precisam conter letras"
      mainDiv.appendChild(span)
      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)
      return;

    } else if(!motorcycleExists) {
      span.style.color = '#FF4C51'
      span.style.background = '#55304C'
      span.style.border = '2px solid #55304C'
      span.textContent = "A moto nao esta registrada no programa. Verifique os campos."
      mainDiv.appendChild(span)
      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)
      return;
    }
    
    const res = await fetch("/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({code, color, value, status, model: motorcycleModel})
    })
    const data: Data = await res?.json()

    if(res.status === 202 || res.ok) {
      const bikeToUpdated = bikes?.find(bike => bike.code === data.code)
      const index = bikes!.findIndex(bike => bikeToUpdated!.code === bike.code)
      
      if(bikeToUpdated && bikes) {
        const updatedData = {
          id: data.id,
          code: data.code,
          color: data.color,
          model: data.model,
          status: data.status,
          value: data.value,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
        }

        const updatedBike = {...bikeToUpdated, ...updatedData}
        bikes[index] = updatedBike
        localStorage.setItem('motorcycles', JSON.stringify(bikes))

        span.style.color = '#56CA00'
        span.style.background = '#354546'
        span.style.border = '2px solid #354546'
        span.textContent = data.message
        mainDiv.appendChild(span)

        setTimeout(() => {
          mainDiv.removeChild(span)
        }, 2500)
        return;
      }
    } else {
      span.style.color = '#FF4C51'
      span.style.background = '#55304C'
      span.style.border = '2px solid #55304C'
      span.textContent = data.message
      mainDiv.appendChild(span)
      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)
      return;
    }
  }
  return (
    <div className={`bg-backgroundColor h-screen main`}>
      <Header titleText="Editar"/>
      <form onSubmit={handleForm} className="flex flex-col items-center gap-8">
        <h1 className={`text-light-grey text-center text-xl sd:text-2xl`}>Edite as informações que preferir! 📝</h1>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" value={`#${query.id}`} readOnly className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`}/>
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm -translate-y-5 text-sm`}>Código</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setMotorcycleModel(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`}/>
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Modelo da Moto</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setColor(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`}/>
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Cor</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setValue(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`}/>
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Valor</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <select required value={status} onChange={(e) => setStatus(e.target.value)} className={`bg-backgroundColor w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`}> 
            <option value="">Clique para definir o status abaixo: </option>
            <option value="Em estoque">Em estoque</option>
            <option value="Sem estoque">Sem estoque</option>
            <option value="Em transito">Em transito</option>
          </select>
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none -translate-y-6`}>Status</span>
        </div>
        <div className={`flex flex-col relative`}>
          <input type="submit" value={`⬆️ ATUALIZAR`} className={`w-80 md:w-[490px] text-light-grey bg-light-blue font-extrabold rounded h-10 cursor-pointer`}/>
        </div>
      </form>
    </div>
  )
}