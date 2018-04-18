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
  <Frame childData={{
    'name': '安全后台管理系统',
    'key': '4'
  }}>
    <div className={css.header}>
     安全后台管理系统
    </div>
    <div className={css.content}>
      <TagList
        width={200}
        height={500}
        onAdd={add}
        onRemoved={removed}
        onSelected={selected}
        data={['任务1', '任务2', '任务3']}
        plusName='添加任务'
      />
    </div>
  </Frame>,
  document.getElementById('root')
)
