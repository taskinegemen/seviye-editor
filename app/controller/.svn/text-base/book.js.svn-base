/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 03.07.2013
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */
function BookCtrl($scope, $routeParams, $location) {

    $scope.bookID = $routeParams.bookID;

    $.get('http://api.linden.pro/book/' + String($scope.bookID), {token: $.cookie('token')}, function (data) {
        if(data.status == true) {
            $scope.bookTitle = data.title;
            $scope.bookTotalPage = data.totalPageNumber;
            var range = [];
            for (var i = 0; i < $scope.bookTotalPage; i++) {
                range[i] = i + 1;
            }
            $scope.bookPageRange = range;
            safeApply($scope);
        } else {
            error(data, 'Kitap yüklemede problem oluştu.');
        }
    }, 'json');

}