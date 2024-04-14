import React, { FC } from 'react'

type PropsType = {
  title: string
  description?: string
}

const QuestionInfo: FC<PropsType> = ({ title, description }) => {
  return <div style={{ textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
}

export default QuestionInfo
