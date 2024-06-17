import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Data = {
  id?: string;
  color: string;
  model: string;
  value: string;
  status: string;
  code: string;
  textColor: string;
  backgroundColor: string;
}


interface IHeaderProps {
  titleText: string
  searchInput?: boolean
  items?: Array<Data> | null
}

export default function Header({titleText, searchInput, items}: IHeaderProps) {
  const [search, setSerachValue] = useState<string>("")

  useEffect(() => {
    const cards = document.querySelectorAll('.card')
    search.toLocaleLowerCase()
    const cardsArray = Array.from(cards)
    const cardsAsDiv = cardsArray.map(card => card as HTMLDivElement)
    if(search.length >= 1) {
      
      cardsAsDiv.forEach(card => {
        const isVisible = card.dataset.motoModel?.toLowerCase().includes(search) ||
        card.dataset.motoCode?.toLowerCase().includes(search) || 
        card.dataset.motoColor?.toLowerCase().includes(search)

        card.style.display = isVisible ? "flex" : "none"
      })
    } else {
      cardsAsDiv.forEach(card => {
       card.style.display = "flex"
      })
    }

  },[search, items])

  return (
  <div className="sm:mb-16">
    <div className={`flex gap-4 justify-end py-6 px-10 sm:mb-6`}>
        <Link href={"/"}>
          <Image src={"/vector.png"} height={25} width={25} alt="Home icon that redirect people to home page"/>
        </Link>
        <Link href={"/"}>
          <Image src={"/avatar-1-aac046b6 1.png"}  className={`rounded-full`} height={25} width={25} alt="Avatar icon of the user"/>
        </Link>
    </div>
    <div className="flex items-center gap-6 pb-3.5 sm:gap-0 justify-between mx-12 border-b-2 border-light-grey-700">
        <h1 className={`text-light-grey mb-4 text-2xl`}>{titleText}</h1>
        {
        searchInput? 
        <div className={`flex flex-col gap-2 sm:flex-row relative items-center`}>
          <input required type="search" onChange={e => setSerachValue(e.target.value)} className={
            `text-light-grey bg-transparent border-2 h-8 pl-8 border-light-grey-800 outline-none rounded peer sm:w-96`
            }/>
          <Image src={"/Vector.svg"} alt="A lupe for search input" className={`absolute h-4 top-[8px] left-[7px]`} height={20} width={20}/>
          <span className="absolute top-[3px] left-[34px] text-xs sm:text-base text-light-grey pointer-events-none bg-backgroundColor duration-200 
          peer-focus:-translate-y-4 peer-focus:text-xs peer-valid:-translate-y-4 peer-valid:text-xs">Buscar por código, nome e cor</span>
          <Link href={"/registrar-motos"}>
            <button className={`bg-light-blue text-light-grey h-8 rounded px-3 text-xs font-extrabold`}>+ NOVO REGISTRO</button>
          </Link>
        </div>
        : ""
        }
    </div>
  </div>
  )
}