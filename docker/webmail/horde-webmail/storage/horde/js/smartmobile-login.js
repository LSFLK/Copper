/**
 * Provides the javascript for the smartmobile login script.
 *
 * @author     Michael Slusarz <slusarz@horde.org>
 * @copyright  2014-2015 Horde LLC
 * @license    LGPL-2 (http://www.horde.org/licenses/lgpl)
 */

$(document).bind("pageinit", function() {
    $("#login form").on('submit', function() {
        if ($("#horde_user").val() === "") {
            window.alert(HordeLogin.user_error);
            $("#horde_user").focus();
        } else if ($("#horde_pass").val() === "") {
            window.alert(HordeLogin.pass_error);
            $("#horde_pass").focus();
        } else {
            $("#horde-login-post").val(1);
            $(this).find('input[type="submit"]').button('disable');
            $.mobile.showPageLoadingMsg();
        }
    });

    /* Programatically activate views that require javascript. */
    var s = $('#horde_select_view');
    if (s) {
        s.find('option[value=mobile_nojs]').remove();
        if (HordeLogin.pre_sel) {
            s.get(0).selectedIndex = s.find('option[value=' + HordeLogin.pre_sel + ']').index;
        }
        s.selectmenu('refresh');
        $('#horde_select_view_div').show();
    }
});

var HordeLogin = {};
