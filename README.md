## 数据列表已tag的形式展现可维护

* 支持tag的拖动排序
* 支持tag的添加
* 支持tag的删除
* 支持tag的搜索

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>拖拽代码参考</title>
  <style>
    .column {
      height: 200px;
      width: 200px;
      float: left;
      border: 1px solid black;
      background-color: green;
      margin-right: 5px;
      text-align: center;
      cursor: move;
    }
    .column header {
      color: black;
      text-shadow: #000 0 1px;
      box-shadow: 5px;
      padding: 5px;
      background: red;
      border-bottom: 1px solid black;
    }
    .column.over {
      border: 3px dashed #000;
    }
  </style>
</head>
<body>
  <div id="columns">
    <div class="column" draggable="true"><header>div1</header></div>
    <div class="column" draggable="true"><header>div2</header></div>
    <div class="column" draggable="true"><header>div3</header></div>
  </div>
</body>
<script>
  function test(me, type) {
    console.log(me.innerHTML, type)
  }
  var columns = document.querySelectorAll('#columns .column');

  var dragEl = null;

  [].forEach.call(columns,function(column){
    column.addEventListener("dragstart",domdrugstart,false);
    column.addEventListener('dragenter', domdrugenter, false);
    column.addEventListener('dragover', domdrugover, false);
    column.addEventListener('dragleave', domdrugleave, false);
    column.addEventListener('drop', domdrop, false);
    column.addEventListener('dragend', domdrapend, false);
  });

  function domdrugstart(e) {
    e.target.style.opacity = '0.5';

    dragEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html",this.innerHTML);
    test(this,'dragstart')
  }
  function domdrugenter(e) {
    e.target.classList.add('over');
    test(this,'dragenter')
  }
  function domdrugover(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    //e.dataTransfer.dropEffect = 'move';
    test(this,'dragsover')
    return false;
  }
  function domdrugleave(e) {
    e.target.classList.remove('over');
    test(this,'dragleave')
  }
  function domdrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragEl != this) {
      dragEl.innerHTML = this.innerHTML;
      this.innerHTML = e.dataTransfer.getData('text/html');
    }
    test(this,'dragdrop')
    return false;
  }
  function domdrapend(e) {
    [].forEach.call(columns, function (column) {
      column.classList.remove('over');
       column.style.opacity = '1';
    });
  }
</script>
</html>
```