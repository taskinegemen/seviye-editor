/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 03.07.2013
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */
function TokenCtrl($scope, $routeParams, $location) {
    if ($.cookie('token') != undefined) {
        $scope.token = $.cookie('token');
        $scope.firstname = $.cookie('firstname');
        $scope.lastname = $.cookie('lastname');
        if ($location.url() == '/kullanici/giris' || $location.url() == '/') {
            window.location = '/kitaplar';
        }
    } else {
        $('<div>').dialog({
            open: function () {

                $(this).html($("div#login")[0].outerHTML);
                $(this).find("div#login").show();
                var $dialog = $(this);
                var $form = $(this).find("form");

                $form.submit(function (e) {
                    e.preventDefault();
                    $.get($form.attr('action'), $form.serialize(), function (data) {
                        if (data.status == true) {

                            $.cookie('token', String(data.token));
                            $.cookie('firstname', String(data.firstname));
                            $.cookie('lastname', String(data.lastname));
                            $scope.token = data.token;
                            $scope.firstname = data.firstname;
                            $scope.lastname = data.lastname;

                            $scope.$apply();

                            $.get('http://api.linden.pro/token-property/set?defaults[width]=698&defaults[cover_width]=292&token=' + String(data.token));

                            window.location = '/kitaplar';

                            $dialog.dialog("close");
                        } else {
                            Dialog.alert('Hata', 'Lütfen giriş yaptığınız bilgileri gözden geçirin ve tekrar deneyin.');
                        }
                    }, 'json');
                });
            },
            close: function (e, i) {
                $(this).remove();
            },
            resizable: false,
            closable: false,
            height: 275,
            width: 400,
            title: 'Giriş',
            modal: true,
            buttons: {
                'Giriş': function () {
                    $form = $(this).find("form");
                    $form.submit();
                }
            },
            create: function () {
                $(this).closest(".ui-dialog").find("button").addClass("btn");
                $(this).closest(".ui-dialog").find("button:contains(Giriş)").addClass("btn-primary");
            }
        });
    }
}