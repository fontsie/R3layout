//TODO la somma di botton/top || left/right non deve superare il totale    

/*prototype*/


if (!Element.prototype.remove){
    Element.prototype.remove = function() {
        this.parentNode.removeChild(this);
    }
}

if (!Element.prototype.removeClass){
    Element.prototype.removeClass = function(c) {
        var classes = this.className;
        var regexp = new RegExp(c + '\s?');
        classes = classes.replace(regexp, '');
        this.className = classes.trim();
    }
}

if (!Element.prototype.addClass){
    Element.prototype.addClass = function(c) {
        var classes = this.className;
        var regexp = new RegExp(c);
        if (!regexp.test(classes)) {
            classes += ' ' + c;
        }
        this.className = classes.trim();
    }
}

function R3_layout(wrapper, main, sidebar, position) {
    
    this.wrapper = wrapper;
    this.main = main;
    this.sidebar = sidebar;
    this.defaultDimension = 200;
    if (position) {
        this.position = position;
    } else {
        this.position = 'right';
    }        
    this.setPosition();
}

R3_layout.prototype.setPosition = function(){
    this.verso = -1;
    switch (this.position) {
        case 'right':
            this.verso = 1;
        case 'left' :
            this.dimension = 'width';
            this.maxDimension = this.wrapper.clientWidth;
            break;
        
        case 'bottom':
            this.verso = 1;
        case 'top'   :
            this.dimension = 'height';
            this.maxDimension = this.wrapper.clientHeight;
            break;
        
        default:
            console.log('error position:' + this.position);
    }
    this.init();
}

R3_layout.prototype.setMinDimension = function(n){
    this.defaultDimension = n;
}

R3_layout.prototype.init = function(){
    if (this.sidebar.parentNode != this.wrapper || this.sidebar.parentNode != this.wrapper) {
        console.log('error element not correct')
        return;
    }
    this.dragbar = document.createElement('div');
    this.dragbar.addClass('R3_bar');
    this.dragbar.addClass('R3_'+this.position);
    this.dragbar.style[this.position] = this.defaultDimension + 'px';
    this.wrapper.appendChild(this.dragbar);
    this.dragbarDelta;
    if (this.dimension == 'width') {
        this.dragbarDelta = this.dragbar.offsetWidth;
    } else {
        this.dragbarDelta = this.dragbar.offsetHeight;
    }
    this.dragbar.style[this.position] = this.defaultDimension + 'px';
    
    
    this.wrapper.addClass('R3_wrapper');
    this.sidebar.addClass('R3_sidebar');
    this.sidebar.addClass('R3_'+this.position);
    this.main.addClass('R3_main');
    this.main.addClass('R3_'+this.position);
    this.sidebar.style[this.dimension] = this.defaultDimension + 'px';
    this.main.style[this.position] = this.defaultDimension + this.dragbarDelta + 'px';
    
}

R3_layout.prototype.collapsible = function() {
    var that = this;
    this.closeSidebar = document.createElement('div');
    this.closeSidebar.addClass('R3_button');
    this.closeSidebar.addClass('R3_close');
    this.closeSidebar.addClass('R3_'+this.position);
    this.dragbar.appendChild(this.closeSidebar);
    this.closeSidebar.onmousedown = function(e){
        e = e || window.event;
        e.stopPropagation();
    }
    this.close = function() {
        var value = parseFloat(that.sidebar.style[that.dimension]);
        that.sidebar.style[that.dimension] = '0';
        that.main.style[that.position] =  '0';
        that.dragbar.style[that.position] = '0';
        that.closeSidebar.removeClass('R3_close');
        that.closeSidebar.addClass('R3_open');
        that.open = function() {
            if (value != "") {
                that.sidebar.style[that.dimension] = value + 'px';
                that.main.style[that.position] = value + that.dragbarDelta + 'px';
                that.dragbar.style[that.position] = value + 'px';
            } else {
                that.sidebar.style[that.dimension] = that.defaultDimension + 'px';
                that.ghostbar.main.style[that.position] = that.defaultDimension + that.dragbarDelta + 'px';
                that.dragbar.style[that.position] = that.defaultDimension + 'px';
            }
            that.closeSidebar.removeClass('R3_open');
            that.closeSidebar.addClass('R3_close');
            that.closeSidebar.onclick = that.close;
        }
        that.closeSidebar.onclick = that.open;
    }
    
    this.closeSidebar.onclick = this.close;
}

R3_layout.prototype.resizable = function() {
    this.dragbar.addClass('R3_resize');
    this.handlerResize = document.createElement('div');
    this.handlerResize.addClass('R3_button');
    this.handlerResize.addClass('R3_handler');
    this.handlerResize.addClass('R3_'+this.position);
    this.dragbar.appendChild(this.handlerResize);
    this.ghostbar;
    this.dragging = false;
    var pageOffset;
    var delta;
    var open = false;
    var that = this;
    var tmp;
    
    this.dragbar.onmousedown = function(e){
        e = e || window.event;
        that.dragging = true;
        if (that.sidebar.style[that.dimension] == '0px') {
            if (that.closeSidebar) {
                that.closeSidebar.removeClass('R3_close');
                that.closeSidebar.addClass('R3_open');
            }
            open = true;
        }
        that.ghostbar = that.dragbar.cloneNode(true);
        that.ghostbar.addClass('R3_ghostbar');
        delta = 0;
        if (that.dimension == 'width') {
            pageOffset = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        } else {
            pageOffset = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        var drag = function(){
                if (that.dragging) {
                    that.dragging = false;
                    var value = parseFloat(that.ghostbar.style[that.position]);
                    if (value < 100) {
                        if (that.closeSidebar) {                            
                            that.closeSidebar.click();
                            that.ghostbar.remove();
                            return;    
                        } else {
                            value = 0;
                        }
                        if (open) {
                            value = tmp;
                        } else {
                            tmp = parseFloat(that.sidebar.style[that.dimension]);
                        }
                    } else if (value > (that.maxDimension - that.dragbarDelta)) {
                        value = that.maxDimension - that.dragbarDelta;
                    }
                    if (open && that.closeSidebar) {
                        that.closeSidebar.onclick = that.close;
                        that.closeSidebar.removeClass('R3_open');
                        that.closeSidebar.addClass('R3_close');
                    }
                    open = false;
                    that.sidebar.style[that.dimension] = value + 'px';
                    that.main.style[that.position] = value + that.dragbarDelta + 'px';
                    that.dragbar.style[that.position] = value + 'px';
                    if(that.ghostbar.parentNode) {
                        that.ghostbar.remove();
                    }
                }
                document.body.removeEventListener('mouseup', drag);
            }
            document.body.addEventListener('mouseup', drag);
        return false;
    }

    this.wrapper.addEventListener('mousemove', function(e) {
        e = e || window.event;
        if (that.dragging) {
            that.wrapper.appendChild(that.ghostbar);
            if (that.dimension == 'width') {
                    delta = that.verso * (pageOffset - e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
                    pageOffset = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;

            } else {
                    delta = that.verso * (pageOffset - e.clientY + document.body.scrollTop + document.documentElement.scrollTop);
                    pageOffset = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            that.ghostbar.style[that.position] = parseFloat(that.ghostbar.style[that.position]) + delta + 'px';
        }
        return false;
    });

}
