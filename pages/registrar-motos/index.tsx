import Header from "@/components/Header"
import { useState } from "react";

type Data = {
  formatedData: Data;
  message: string | null;
  id?: string;
  color: string;
  model: string;
  value: number;
  status: string;
  code: string;
}

export default function Motorcycletable() {
  const [code, setCode] = useState<string>("");
  const [motorcycleModel, setMotorcycleModel] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  
  const handleForm = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
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

    }
    
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({code, color, value, status, model: motorcycleModel})
    })
    const data: Data = await res?.json()

    if(res.status === 202 || res.ok) {
      const bikesString = localStorage.getItem('motorcycles');
      const bikes: Array<Data> | null = bikesString ? JSON.parse(bikesString) : localStorage.setItem("motorcycles", JSON.stringify([data.formatedData]));
      if(bikes) {
        bikes.push(data.formatedData)
        localStorage.setItem("motorcycles", JSON.stringify(bikes))

        span.style.color = '#56CA00'
        span.style.background = '#354546'
        span.style.border = '2px solid #354546'
        span.textContent = data.message
        mainDiv.appendChild(span)

        setTimeout(() => {
          mainDiv.removeChild(span)
        }, 2500)
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
    <main
      className={`bg-backgroundColor h-screen main`}
    >
      <Header titleText="Registro de Motos"/>
      <form onSubmit={handleForm} className="flex flex-col items-center gap-8">
        <h1 className={`text-light-grey text-center text-xl sd:text-2xl`}>Preencha as informações a baixo para registrar uma Moto 🏍️</h1>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setCode(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`} id="" />
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Código</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setMotorcycleModel(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`} id="" />
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Modelo da Moto</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setColor(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`} id="" />
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Cor</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <input required type="text" onChange={e => setValue(e.target.value)} className={`pl-3 bg-transparent w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`} id="" />
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none 
            transform duration-200 peer-focus:-translate-y-5 peer-focus:text-sm peer-valid:-translate-y-5 peer-valid:text-sm`}>Valor</span>
        </div>
        <div className={`flex flex-col relative text-light-grey`}>
          <select required value={status} onChange={(e) => setStatus(e.target.value)} className={`bg-backgroundColor w-80 md:w-[490px] h-12 relative outline-none peer border border-light-grey-700 rounded-md`} id="" > 
            <option value="">Clique para definir o status abaixo: </option>
            <option value="Em estoque">Em estoque</option>
            <option value="Sem estoque">Sem estoque</option>
            <option value="Em transito">Em transito</option>
          </select>
          <span className={`bg-backgroundColor absolute left-1 top-[0.6rem] tracking-wide pointer-events-none -translate-y-6`}>Status</span>
        </div>
        <div className={`flex flex-col relative`}>
          <input type="submit" value={`+ REGISTRAR`} className={`w-80 md:w-[490px] text-light-grey bg-light-blue font-extrabold rounded h-10 cursor-pointer`}/>
        </div>
      </form>
    </main>
  )
}