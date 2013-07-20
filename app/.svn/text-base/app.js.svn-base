/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 08.07.2013
 * Time: 16:50
 * To change this template use File | Settings | File Templates.
 */

var app = angular.module('SeviyeEditor', [], function ($routeProvider, $locationProvider) {
    $routeProvider.when('/kullanici/giris', {
        templateUrl: '/app/view/login.html',
        controller: 'TokenCtrl'
    });
    $routeProvider.when('/kullanici/cikis', {
        templateUrl: '/app/view/logout.html',
        controller: 'LogoutCtrl'
    });
    $routeProvider.when('/kitaplar', {
        templateUrl: '/app/view/books.html',
        controller: 'BooksCtrl'
    });
    $routeProvider.when('/kitap/:bookID', {
        templateUrl: '/app/view/book.html',
        controller: 'BookCtrl'
    });
    $routeProvider.when('/kitap/:bookID/:page', {
        templateUrl: '/app/view/book.html',
        controller: 'PageCtrl'
    });
    $locationProvider.html5Mode(true);
});
app.run(function ($rootScope) {
    $rootScope.search = {
        title: '',
        classID: '',
        courseID: ''
    }
    $rootScope.itemID = '';
    $rootScope.classID = '';
    $rootScope.courseID = '';
})
;

