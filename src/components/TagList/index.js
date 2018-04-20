import React, { Component } from 'react'
import { Tag, Input, Tooltip, Icon, Modal, Pagination } from 'antd';
import css from './index.scss'
const confirm = Modal.confirm;
let dragElement = null
let MyTag = (props) => {
  let type = props.icon.type || 'close'
  let icon = {
    'plus': {
      className: [css['my-tag'], css['tag-action']].join(' '),
      node: (<Icon type="plus" className={css['icon-action']} />)
    },
    'close': {
      className: [css['my-tag']].join(' '),
      node: (<Icon type="close" className={css['icon-action']} onClick={props.icon.event} />)
    }
  }
  let dragStart = (e) => {
    e.target.style.opacity = '0.5'
    dragElement = e.target
    e.dataTransfer.effectAllowed = "move"
  }
  let dragEnter = (e) => {
    e.target.classList.add(css.over)
  }
  let dragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    return false
  }
  let dragLeave = (e) => {
    e.target.classList.remove(css.over)
  }
  let drop = (e) => {
    e.stopPropagation()
    if (dragElement != e.target) {
      let opt = {}
      opt[e.target.dataset.index] = dragElement.dataset.val
      opt[dragElement.dataset.index] = e.target.dataset.val
      props.dataUpdate(opt)
    }
    return false;
  }
  let dragEnd = (e) => {
    let dorgTags = document.querySelectorAll('div[type="close"]')
    dorgTags.forEach((tag) => {
      tag.classList.remove(css.over);
      tag.style.opacity = '1';
    })
  }

  
  let _config ={
      onDragStart: dragStart,
      onDragEnter: dragEnter,
      onDragOver: dragOver,
      onDragLeave: dragLeave,
      onDrop: drop,
      onDragEnd: dragEnd,
      draggable: "true"
  }
  let config = type === 'close' ? _config : {}
  return (
    <div
      {...config}
      type={type}
      data-val={props.val}
      data-index={props.index}
      className={icon[type].className}
      onClick={props.onClick}
    >
      { props.children }
      { icon[type].node }
    </div>
  )
}

export default class Tasks extends Component {
  state = {
    data: [],
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    this.setState({ data: this.props.data })
    this.setState({ tags: this.props.data })
  }

  handleClose = (e) => {
    let removedTag = e.target.parentNode.textContent
    confirm({
      title: '提示！',
      content: '确认要删除吗？',
      cancelText: '否',
      okText: '是',
      onOk: () => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        const data = this.state.data.filter(tag => tag !== removedTag);
        this.setState({ tags, data }, () => {
          this.selectedTagNode && this.selectedTagNode.classList.add(css['tag-selected'])
        });
        this.props.onRemoved(removedTag, data)
      }
    });
    e.stopPropagation();
  }

  handleSelected = (e) => {
    if (this.selectedTagNode) {
      this.selectedTagNode.classList.remove(css['tag-selected'])
    }
    this.selectedTagNode = e.target
    this.selectedTagNode.classList.add(css['tag-selected'])
    this.props.onSelected(this.selectedTagNode.textContent)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    let data = state.data;
    if (inputValue && data.indexOf(inputValue) === -1) {
      data = [...data, inputValue];
      this.props.onAdd(inputValue, data)
    }
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      data,
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  handleInputSearch = (e) => {
    let val = e.target.value
    let tags = this.state.data
    if (val) {
      tags = tags.filter((item) => {
        return item.indexOf(val) !== -1
      })
    }
    this.setState({tags})
  }

  dataUpdate = (opt) => {
    let data = this.state.data
    for(let key in opt) {
      data[key] = opt[key]
    }
    this.setState({data})
  }
  searchInputRef = input => this.searchInput = input
  saveInputRef = input => this.input = input

  render() {
    const { tags, inputVisible, inputValue } = this.state
    const { width, height, pageSize, plusName, searchVisible } = this.props
    return (
      <div>
        {searchVisible && (<Input
          style={{ width }}
          onChange={this.handleInputSearch}
          ref={this.searchInputRef}
          type="text"
          size="small"
          placeholder='输入关键词搜索'
        />)}
        <div className={css.box} style={{width, height}}>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <MyTag 
                key={tag}
                icon={{
                  type: 'close',
                  event: this.handleClose
                }}
                index={index}
                val={tag}
                onClick = {this.handleSelected}
                dataUpdate={this.dataUpdate}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </MyTag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <MyTag
              icon={{
                type:'plus'
              }}
              onClick={this.showInput}
            >
              {plusName}
            </MyTag>
          )}
        </div>
      </div>
    );
  }
}

