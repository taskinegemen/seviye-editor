/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 02.07.2013
 * Time: 02:49
 * To change this template use File | Settings | File Templates.
 */

function safeApply(scope, fn) {
    if (fn == undefined) {
        fn = function () {
        };
    }
    if (scope != undefined) {
        (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
    }
}

function error(response, message) {
    if(response.status && response.status != true) {
        if(response.message && response.message.invalid_token_format) {
            window.location = '/kullanici/giris';
        }
        if(response.message && response.message.no_token_found) {
            window.location = '/kullanici/giris';
        }
    }
    if(message != undefined) {
        Dialog.alert('Hata', message);
    }
}

function bookPageHeight() {
    $("#book-pages").css({'height': ($(window).height() - 336)});
    $("#loader, #editor-bg").css({'min-height': ($(window).height() - 161), 'height': 'auto'});
}

$(document).ready(function () {
    $(window).bind('load resize', function () {
        bookPageHeight();
    });
});

// Dialog
var Dialog = {
    alert : function(title, content) {
        $('<div>').dialog({
            open : function() {
                $(this).html(content);
            },
            close : function(e, i) {
                $(this).remove();
            },
            resizable : true,
            height : 200,
            width : 400,
            title : title,
            modal : true,
            buttons : {
                'Kapat' : function() {
                    $(this).dialog("close");
                }
            },
            create: function () {
                $(this).closest(".ui-dialog").find("button").addClass("btn");
            }
        });
    }
};