import classNames from "classnames"

interface IValidationProps { 
  text: string
  bgColor: string
  border: string
  textColor: string
}

export default function Validation({text, bgColor, border, textColor}: IValidationProps) {

  return (
    <span className={
        classNames(`
        validation
        hidden
        flex absolute i
        tems-center left-[4%] 
        top-[4%] font-bold 
        rounded-lg 
        p-3.5 h-12`, 
        bgColor, 
        border, 
        textColor 
    )}>
      {text}
    </span>
  )
}