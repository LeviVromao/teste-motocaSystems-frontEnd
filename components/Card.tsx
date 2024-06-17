import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";

type Data = {
  id?: string;
  color: string;
  model: string;
  value: string;
  status: string;
  code: string;
  backgroundColor: string;
  textColor: string;
  message?: string | null
}

interface ICardsProps {
  items: Array<Data> | null
}

export default function Card({ items }: ICardsProps) {
  const handleCardRemoval = async () => {
    const trashElement = document.querySelector('.trash') as HTMLImageElement
    const card = document.querySelector('.card') as HTMLDivElement
    const mainDiv = document.querySelector('.main') as HTMLDivElement
    const span = document.createElement('span') as HTMLSpanElement
    const loading = document.querySelector('.loadingSpin') as HTMLImageElement

    loading.style.display = "block"
    trashElement.style.display = "none"
    span.style.position = 'absolute'
    span.style.display = 'flex'
    span.style.alignItems = 'center'
    span.style.left = '4%'
    span.style.top = '4%'
    span.style.fontWeight = '700'
    span.style.padding = '0.875rem'
    span.style.height = "3rem"
    span.style.borderRadius = '8px'
    const code = trashElement.dataset.motoCode
    const id = trashElement.dataset.motoId

    const res = await fetch(`/api/removeMotorcycle`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code, id})
    })
    const data = await res.json()

    if(res.status === 202 || res.ok) {
      loading.style.display = "none"
      loading.style.display = "block"
      const bikesJSON = localStorage.getItem('motorcycles')
      const bikes: Array<Data> = bikesJSON ? JSON.parse(bikesJSON): ""
      const index = bikes.findIndex(bike => bike.id === id)

      if(index !== -1) {
        bikes.splice(index, 1);
      }

      localStorage.setItem('motorcycles', JSON.stringify(bikes))
      card.remove()        
      span.style.color = '#56CA00'
      span.style.background = '#354546'
      span.style.border = '2px solid #354546'
      span.textContent = data.message
      mainDiv.appendChild(span)

      setTimeout(() => {
        mainDiv.removeChild(span)
      }, 2500)

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
    <div className={`flex flex-col gap-6 main`}>
    {items?.length! > 0? (
      items?.map(bike => (
        <div key={bike.id} 
        data-moto-code={bike.code} 
        data-moto-model={bike.model} 
        data-moto-color={bike.color} 
        className={
          `flex items-center justify-between bg-[#312D4B] card mx-3 sm:mx-16 h-32 rounded-lg px-1 sm:px-14 py-2.5 sm:py-[29px] select-none`
        }>
          <div className={`flex items-center gap-8`}>
            <p className={`text-[#8C57FF]`}>{bike.code}</p>
            <div className={`flex gap-3`}>
              <div className={`flex flex-col gap-2.5`}>
                <p className={`text-light-grey font-bold`}>{bike.model}</p>
                <p className={`text-light-grey`}>Valor: {bike.value}</p>
                <p className={`text-light-grey`}>Cor: {bike.color}</p>
              </div>
              <span className={classNames('rounded-md h-fit px-0.5', bike.backgroundColor,  bike.textColor)}>{bike.status}</span>
            </div>
          </div>
          <div className={`flex gap-3.5`}>
            <Image src={`/trash.svg`} data-moto-code={bike.code} data-moto-id={bike.id} onClick={handleCardRemoval} className={`cursor-pointer trash`} alt="A red trash icon" height={20} width={20}/>
            <Image src={`/Ellipse 51.svg`} className={`loadingSpin hidden animate-spin`} alt="A circle loading icon" height={20} width={20}/>
            <Link href={`/edit/${bike.code.replace(/#/gi, '')}`}>
            <Image src={`/eye.svg`} alt="A white eye icon" height={20} width={20}/>
            </Link>
          </div>
        </div>
      ))
    ): 
     <h1 className={`text-light-grey text-base text-center`}>Nenhum item na tabela, registre-os clicando no botão azul, novo registro a direita.</h1>
    }
    </div>
  )
}