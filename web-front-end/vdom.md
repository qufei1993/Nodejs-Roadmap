# 虚拟DOM

## 几个问题：
1. virtualDom是什么？为什么会存在vdom?
2. virtualDom如何应用，核心API有哪些？
3. diff算法的理解

## 问题1

#### virtualDom是什么？为什么会存在vdom?

> 虚拟Dom是用JS来模拟DOM结构，为什么会使用vdom是因为在浏览器里对DOM的操作是非常耗性能的，因此，对DOM的对比操作放在JS层来做，是为了提高效率。

举一个对表格操作的示例：

将以下数据以表格形式展示，数据修改表格也随之改动。

```js
var data = [
    {
        id: 1,
        name: '张先生'
    },
    {
        id: 2,
        name: '李先生'
    }
]
```

Jquery操作DOM实现

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title></title>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
</head>
<body>
    <div id="container"></div>
    <button id="btn-update">修改表格数据</button>
    <script>
        // 数据
        var data = [
            {
                id: 11,
                name: '张先生'
            },
            {
                id: 22,
                name: '李先生'
            }
        ]

    </script>
    <script>
        // 渲染函数
        function render(data) {
            var container = $('#container');

            // 清空容器内容
            container.html('');

            // 拼接table
            var $table = $('<table>');
                $table.append($('<tr><td>ID</td><td>name</td></tr>'));
            
            for (var item of data) {
                $table.append($('<tr><td>' + item.id + '</td><td> ' + item.name + ' </td></tr>'));
            }

            // 渲染到页面
            container.append($table);
        }

        // 单机修改数据
        $('#btn-update').click(function() {
            data[1].id = Math.ceil(Math.random() * 100);

            // 在此渲染
            render(data);
        });

        // 初始化渲染
        render(data);
    </script>
</body>
</html>
```

运行结果

修改数据源之后，可以看到容器清空了重新进行了DOM渲染，只有id=22的表格变动了，其它是没变化了，但是还是全部进行了渲染，项目越复杂，影响将会越严重，解决办法可以看下面的vdom。

![](./img/20190101-jquery-dom.gif) 


