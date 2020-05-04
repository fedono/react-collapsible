import React, {Component} from 'react';

class Collapsible extends Component {
    innerRef = React.createRef();
    timeout = undefined;

    static defaultProps = {
        wrapContainer: 'div',
        triggerContainer: 'span',
        contentContainer: 'div',
        overflowWhenOpen: 'hidden',
        lazyRender: false,
        open: false,
        transitionTime: 400,
        easing: 'linear',
        transitionCloseTime: null
    };

    constructor(props) {
        super(props);

        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
        this.openCollapsible = this.openCollapsible.bind(this);
        this.closeCollapsible = this.closeCollapsible.bind(this);

        if (props.open) {
            const {overflowWhenOpen} = props;
            this.state = {
                isClosed: false,
                height: 'auto',
                transition: 'none',
                overflow: overflowWhenOpen,
                inTransition: false
            }
        } else {
            const {transitionTime, easing} = props;
            this.state = {
                isClosed: true,
                height: 0,
                transition: `height ${transitionTime}ms ${easing}`,
                overflow: 'hidden',
                inTransition: false
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.height === 'auto') {
            window.clearTimeout(this.timeout);

            // Set small timeout to ensure a true re-render
            this.timeout = window.setTimeout(() => {
                this.setState({
                    height: 0,
                    overflow: 'hidden',
                    isClosed: true
                });
            }, 50);
        }
    }

    componentWillUnmount() {
        window.clearTimeout(this.timeout);
    }

    closeCollapsible() {
        const {transitionCloseTime, transitionTime, easing} = this.props;
        this.setState({
            isClosed: true,
            height: this.innerRef.current.scrollHeight,
            transition: `height ${transitionCloseTime ? transitionCloseTime : transitionTime}ms ${easing}`,
            inTransition: true
        });
    }

    openCollapsible() {
        const {transitionTime, easing} = this.props;
        this.setState({
            height: this.innerRef.current.scrollHeight,
            transition: `height ${transitionTime}ms ${easing}`,
            isClosed: false,
            inTransition: true
        });
    }

    handleTriggerClick(event) {
        const {triggerDisabled, handleTriggerClick, accordionPosition, onOpening, onClosing} = this.props;
        const {isClosed, inTransition} = this.state;

        // transition 在没有完成时多次点击触发，会导致动画失效，所以在动画发生的过程中，记录当前动画的状态，动画过程中不让继续触发动画
        if (triggerDisabled || inTransition) {
            return;
        }

        event.preventDefault();

        // 用户自行接管触发动画的过程
        // 比如在内容区的class设置默认transition属性，然后根据当前点击事件动态添加TransitionClassName来实现动画
        if (handleTriggerClick) {
            handleTriggerClick(accordionPosition)
        } else if (isClosed === true) {
            this.openCollapsible();
            onOpening && onOpening();
        } else {
            this.closeCollapsible();
            onClosing && onClosing();
        }
    }

    handleTransitionEnd(event) {
        if (event.target !== this.innerRef.current) {
            return;
        }

        const {overflowWhenOpen, onOpen, onClose} = this.props;
        if (!this.state.isClosed) {
            this.setState({
                height: 'auto',
                overflow: overflowWhenOpen,
                inTransition: false
            });

            onOpen && onOpen();
        } else {
            this.setState({
                inTransition: false
            });
            onClose && onClose();
        }
    }

    render() {
        const {height, transition, overflow, isClosed} = this.state;
        const {
            wrapContainer: WrapContainer, triggerContainer: TriggerContainer, contentContainer: ContentContainer,
            trigger, lazyRender, children: propsChildren, className: propsClassName, openedClassName,
            triggerClassName: propsTriggerClassName, triggerOpenedClassName, triggerStyle, contentClassName
        } = this.props;

        const style = {
            height: height,
            WebkitTransition: transition,
            msTransition: transition,
            transition: transition,
            overflow: overflow
        };

        const children = (lazyRender && isClosed) ? null : propsChildren;
        const triggerClassName = isClosed ? propsTriggerClassName : triggerOpenedClassName;
        const className = isClosed ? propsClassName : openedClassName;

        return (
            <WrapContainer className={className}>
                <TriggerContainer
                    className={triggerClassName}
                    style={triggerStyle}
                    onClick={this.handleTriggerClick}
                >
                    {trigger}
                </TriggerContainer>
                <ContentContainer
                    style={style}
                    className={contentClassName}
                    onTransitionEnd={this.handleTransitionEnd}
                    ref={this.innerRef}
                >
                    {children}
                </ContentContainer>
            </WrapContainer>
        )
    }
}

export default Collapsible;
