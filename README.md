# React Collapsible 组件

## 使用方法
```js
import Collapsible from "./Collapsible";

renderHead = () => {
    return (
        <div className="header">header</div>
    )
}

<Collapsible
    trigger={this.renderHead()}
    onOpen={this.handleOnOpen}
    onClose={this.handleOnClose}
    onOpening={this.handleOnOpening}
    onClosing={this.handleOnClosing}
>
    <div className={className}>
        content
    </div>
</Collapsible>
```

## 关键点
- 如何更新`Collapsible` 内部的内容的高度
  - 整个项目中，`height` 共有三个值，`auto/ 0 / this.innerRef.current.scrollHeight` ，也就是根本就不用去计算，
  > `react-bootstrap`中设置高度是 `offsetHeight + marginTop + marginBottom`
- 如何实现动画的效果
  - 使用原生的 `transition` 动画，设置属性为 `height` ，时间为用户设置的时间，默认的动画效果为`linear` ，动画效果可以提供给用户设置，可以设置的动画效果为 [transition 动画效果集](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function)
  - 在内容动画的过程中，如果多次触发动画，会导致动画失效的问题，解决办法是，增加动画时候的状态，在动画的过程中，点击触发动画无效，待动画完成后可继续点击
- 懒加载
  - `lazyRender` 在折叠的时候不加载内部内容，直到展开的时候
- 其他的附加效果
  - 开始展开动画时候的事件
    - 在打开的时候，调用 `onOpening` 事件
  - 开始结束展开动画时候的事件
    - 在收起的时候，调用 `onClosing` 事件
  - 已展开的事件
    - 使用的元素上的 `onTransitionEnd` 事件，这时候判断当前状态是展开还是收起了，如果展开那就调用 `onOpen` ，如果结束就调用 `onClose` 事件
- 用户可以自行接管动画的触发效果
  - 在 `triggerContainer` 中触发的动画，用户可以自行接管，比如在 contentContainer 中设置默认的 `transition`样式，当触发动画时
  添加 `className` 为`show`，也就是触发之后的动画属性, 这样就能够实现动画效果了。

注：Idea 和源码参考 [react-collapsible](https://www.npmjs.com/package/react-collapsible)，但我觉得我写的更好，还给对方修复了一个bug
