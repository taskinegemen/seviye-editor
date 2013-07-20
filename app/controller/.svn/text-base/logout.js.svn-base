/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 03.07.2013
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */
function LogoutCtrl($scope, $routeParams, $location) {
    $.removeCookie('token');
    $.removeCookie('firstname');
    $.removeCookie('lastname');
    $location.url('/kullanici/giris');
}