/*
    ADAIN Jquery Banner Rolling Plugin Version 1.0
    Copyright (C) 2012 ADAIN

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Email : jsy@adain.kr (SungYong Jang)
    Basic Usage
    <div id="banner">
        <ul>
            <li><img src="1.jpg" /><li>
            <li><img src="2.jpg" /><li>
            <li><img src="3.jpg" /><li>
        </ul>
    </div>
    <a href="javascript:banner.movePrev();">prev</a>
    <a href="javascript:banner.moveNext();">next</a>
    
    <script type="text/javascript">
    $(function(){
       window.banner = $("#slider").adainBanner({ 
           autoPlay: true, direction: 'left'
       }, onBannerMoved);
    });
    function onBannerMoved(index, oldIndex)
    {
        console.log(index + "," + oldIndex);
    }
    </script>
*/
(function($){
    
    $.ABanner = function(element, options, onMoveHandler){
        this.$el = element;
        this._init(options);
        this.onMoveHandler = onMoveHandler;
    };
    
    $.ABanner.defaults = {
        currentIndex    : 0,
        interval        : 5000,
        autoPlay        : true,
        direction       : 'left' // left or up
    };
    
    $.ABanner.prototype = {
        _init : function(options){
            this.options = $.extend( true, {}, $.ABanner.defaults, options );
            this.$container = this.$el.find('ul');
            this.$banners = this.$container.children();
            this.totalLength = this.$banners.length;
            this.direction = this.options.direction;
            this.moveWidth = parseInt(this.$banners.css("width"));
            this.moveHeight = parseInt(this.$banners.css("height"));
            
            // css
            this.$el.css("overflow", "hidden");
            this.$container.css({
                position : "absolute"
            });
            
            if(this.direction == "left")
            {
                this.$container.css("width", (this.moveWidth * this.totalLength) + "px");
                this.$banners.css("float", "left");
            }
            else
            {
                this.$container.css("height", (this.moveHeight * this.totalLength) + "px");
                this.$banners.css("float", "none");
            }
            
            // move default index
            this.moveTo(this.options.currentIndex);
            
            // auto play
            this.interval = this.options.interval;
            this.autoPlay = this.options.autoPlay;
            this.intervalId = null;
            if(this.autoPlay && this.interval > 0)
            {
                this.startRolling(this.interval);
            }             
        }
        ,
        moveNext : function(){
            var newIndex = this.currentIndex + 1;
            if(newIndex == this.totalLength) newIndex = 0;
            this.moveTo(newIndex);
        }
        ,
        movePrev : function(){
            var newIndex = this.currentIndex - 1;
            if(newIndex < 0) newIndex = this.totalLength - 1;
            this.moveTo(newIndex);
        }
        ,
        moveTo : function(index){
            var oldIndex = this.currentIndex;
            this.currentIndex = index;
            
            if(this.direction == "left")
            {
                this.$container.animate({"margin-left": -(this.currentIndex * this.moveWidth) + "px"});   
            }
            else
            {
                this.$container.animate({"margin-top": -(this.currentIndex * this.moveHeight) + "px"});
            }
            
            if(this.onMoveHandler && typeof this.onMoveHandler == "function") this.onMoveHandler(this.currentIndex, oldIndex);
        }
        ,
        stopRolling : function(){
            clearInterval(this.intervalId);
        }
        ,
        startRolling : function(intervalMS){
            
            var _self = this;
                        
            if(intervalMS) this.interval = intervalMS;
            this.intervalId = setInterval(function(){_self.moveNext();}, this.interval);
            
            this.$el.unbind("hover");
            this.$el.hover(
                function(){
                    _self.stopRolling();    
                }
                ,
                function(){
                    _self.startRolling();
                }
            );
        }
    };
    
    var logError = function( message ) {
        if ( this.console ) {
            console.error( message );
        }
    };
    
    $.fn.adainBanner = function(options, onBannerMoved){
        return new $.ABanner(this, options, onBannerMoved);
    };
    
})(jQuery);