import React, {Component} from 'react';

class Collapse extends Component {
    innerRef = React.createRef();
    timeout = undefined;

    static defaultProps = {
        easing: 'linear',
        TriggerContainer: 'span',
        overflowWhenOpen: 'hidden',
        contentElement: 'div',
        WrapContainer: 'div',
        lazyRender: false,
        open: false,
        transitionTime: 400,
        transitionCloseTime: null,
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
                overflow: overflowWhenOpen
            }
        } else {
            const {transitionTime, easing} = props;
            this.state = {
                isClosed: true,
                height: 0,
                transition: `height ${transitionTime}ms ${easing}`,
                overflow: 'hidden'
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

        // If there has been a change in the open prop (controlled by accordion)
        if (prevProps.open !== this.props.open) {
            if (this.props.open === true) {
                this.openCollapsible();
                this.props.onOpening();
            } else {
                this.closeCollapsible();
                this.props.onClosing();
            }
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
            transition: `height ${transitionCloseTime ? transitionCloseTime : transitionTime}ms ${easing}`
        });
    }

    openCollapsible() {
        const {transitionTime, easing} = this.props;
        this.setState({
            height: this.innerRef.current.scrollHeight,
            transition: `height ${transitionTime}ms ${easing}`,
            isClosed: false
        });
    }

    handleTriggerClick(event) {
        const {triggerDisabled, handleTriggerClick, accordionPosition, onOpening, onClosing} = this.props;
        const {isClosed} = this.state;

        if (triggerDisabled) {
            return;
        }

        event.preventDefault();

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
        // 每次 handleTransitionEnd 失效都是从展开到关闭的时候
        if (event.target !== this.innerRef.current) {
            return;
        }

        const {overflowWhenOpen, onOpen, onClose} = this.props;
        if (!this.state.isClosed) {
            this.setState({
                height: 'auto',
                overflow: overflowWhenOpen
            });

            onOpen && onOpen();
        } else {
            onClose && onClose();
        }
    }

    render() {
        const {height, transition, overflow, isClosed} = this.state;
        const {
            TriggerContainer, trigger, lazyRender, children: propsChildren, triggerOpenedClassName,
            triggerClassName: propsTriggerClassName, className: propsClassName, openedClassName,
            WrapContainer, triggerStyle, contentClassName
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
                <div
                    style={style}
                    className={contentClassName}
                    onTransitionEnd={this.handleTransitionEnd}
                    ref={this.innerRef}
                >
                    {children}
                </div>
            </WrapContainer>
        )
    }
}

export default Collapse;
