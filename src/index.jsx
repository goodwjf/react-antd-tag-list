import React from 'react'
import { render } from 'react-dom'
import TagList from './components/TagList'
import { Frame } from '../components/frame'
import css from './index.scss'

let selected = (tag) => {
  console.log(tag)
}

let removed = (tag, tags) => {
  console.log(tag, tags)
}

let add = (tag, tags) => {
  console.log(tag, tags)
}

render(
  <TagList
    width={200}
    height={500}
    onAdd={add}
    onRemoved={removed}
    onSelected={selected}
    data={['任务1', '任务2', '任务3']}
    plusName='添加任务'
  />,
  document.getElementById('root')
)
