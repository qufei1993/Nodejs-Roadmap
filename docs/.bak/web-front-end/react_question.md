# React开发中遇到的问题汇总

## 目录

* [question1 Warning: Expected server HTML to contain a matching div in div.](#question1)

## question1

出现以下错误是因为react16.1加了一个提醒，在没有提供服务端渲染的情况下，使用hydrate会有这个warning，因为hydrate是用在有服务端渲染的情况。如果你没有使用ssr，请使用ReactDOM.render.

``` Warning: Expected server HTML to contain a matching <div> in <div>. ```
