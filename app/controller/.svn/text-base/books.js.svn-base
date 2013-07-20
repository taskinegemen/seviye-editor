/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 03.07.2013
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */
function BooksCtrl($scope) {

    $scope.books = [];

    $.get('http://api.linden.pro/book', {token: $.cookie('token')}, function (data) {
        if(data.status == true) {
            $scope.books = data.books;
            safeApply($scope);
        } else {
            error(data, 'Kitapların yüklemesinde problem oluştu.');
        }
    }, 'json');

    $scope.findByID = function(bookID) {
        for(book in $scope.books) {
            if(book.ID == bookID) {
                return book;
            };
        }
    }

}