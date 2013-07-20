/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 13.07.2013
 * Time: 02:37
 * To change this template use File | Settings | File Templates.
 */
function ItemCtrl($scope, $rootScope) {
    $scope.classes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    $scope.courses = [
        {ID: 1, title: 'Kimya'},
        {ID: 2, title: 'Matematik'},
        {ID: 3, title: 'Fizik'},
        {ID: 4, title: 'Biyoloji'},
        {ID: 5, title: 'Edebiyat'},
        {ID: 6, title: 'Geometri'},
        {ID: 7, title: 'Dil ve Anlatım'},
        {ID: 8, title: 'Felsefe'},
        {ID: 9, title: 'İngilizce'},
        {ID: 10, title: 'Din Kültürü'},
        {ID: 11, title: 'Coğrafya'},
        {ID: 12, title: 'Psikoloji'},
        {ID: 13, title: 'Sağlık Bilgisi'}
    ];

    $scope.items = [];
    $.get('http://api.linden.pro/item', {
        width: $scope.width,
        token: $.cookie('token')
    }, function (data) {
        if (data.status == true) {
            for (var i = 0; i < data.items.length; i++) {
                $scope.items.push(data.items[i]);
            }
            safeApply($scope);
        } else {
            error(data, 'Materyallerin yüklemesinde problem oluştu.');
        }
    });

    $scope.setClass = function (classID) {
        if ($rootScope.classID != classID) {
            $rootScope.itemID = '';
            $rootScope.classID = classID;
            $rootScope.search.classID = classID;
        } else {
            $rootScope.classID = '';
            $rootScope.search.classID = '';
        }
    };

    $scope.setCourse = function (courseID) {
        if ($rootScope.courseID != courseID) {
            $rootScope.itemID = '';
            $rootScope.courseID = courseID;
            $rootScope.search.courseID = courseID;
        } else {
            $rootScope.courseID = '';
            $rootScope.search.courseID = '';
        }
    };

    $scope.setItem = function (itemID) {
        if ($rootScope.itemID != itemID) {
            $rootScope.itemID = itemID;
        } else {
            $rootScope.itemID = '';
        }
    };
}