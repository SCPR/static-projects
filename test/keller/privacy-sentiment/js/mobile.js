$(document).ready(function(){
    function toggle_button(the_id, turn_off){
        $('.map-tooltip').hide();

        var $obj = $('#' + the_id);

        if($obj.hasClass('active'))
        {
            $obj.removeClass('active');
            $('#map_canvas,#navline').show();
            $obj.attr('href', '#chart');
        }
        else if (!turn_off)
        {
            $obj.addClass('active');
            $('#map_canvas,#navline').hide();
        }

    }

    function hashchange() {
        var hash = location.hash;

        if (hash == '#details')
        {
            $('#details').show();
            $('#share').hide();
            toggle_button('sharelink', 'turnoff');
            toggle_button('detailslink');
            $('body').delay('100').animate({ scrollTop: '0px' }, 'slow');
        }
        else if (hash == '#share')
        {
            $('#share').toggle();
            $('#details').hide();
            toggle_button('detailslink', 'turnoff');
            toggle_button('sharelink');
            $('body').delay('100').animate({ scrollTop: '0px' }, 'slow');
        }
        else
        {
            $('#share').hide();
            $('#details').hide();
            toggle_button('detailslink', 'turnoff');
            toggle_button('sharelink', 'turnoff');
            $('body').delay('100').animate({ scrollTop: '0px' }, 'slow');


        }
            

    }
    $(window).on('hashchange', hashchange);
    $('.navlink').click(function(){
        var $this = $(this);
        var href = $this.attr('href');
        var hashlink = $this.data('hash');

        if (href == hashlink)
        {
            $this.attr('href', '#chart');
        }
        else
        {
            $this.attr('href', hashlink);
        }
        if (!('onhashchange' in window))
        {   
            // For blackberry, old iphone, etc
            location.hash = $this.attr('href');
            hashchange();
        }
        return true;
    });

        
        

    $('body').delay('100').animate({ scrollTop: '0px' }, 'slow');


    // Project specific

});
