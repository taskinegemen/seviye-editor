/**
 * Created with JetBrains PhpStorm.
 * User: ahmetsametyuzlu
 * Date: 02.07.2013
 * Time: 03:20
 * To change this template use File | Settings | File Templates.
 */

function PageCtrl($scope, $rootScope, $routeParams, $location) {

    $scope.page = ($routeParams.page != undefined ? parseInt($routeParams.page) : 1);
    $scope.width = 698;
    $scope.isLoading = false;

    $scope.next = function () {
        $scope.go($scope.page + 1);
    }
    $scope.prev = function () {
        $scope.go($scope.page - 1);
    }
    $scope.go = function (page) {

        $scope.isLoading = true;
        $scope.page = page;

        var img = new Image();
        img.src = $scope.pageUrl($scope.$parent.bookID, $scope.page, $scope.width);
        $(img).load(function (e) {
            $scope.isLoading = false;
            safeApply($scope);
        }).each(function () {
                if (this.complete) {
                    $(this).trigger('load');
                }
            });
        if ($scope.page <= 1) {
            $("#page-prev").attr('disabled', 'disabled');
        } else {
            $("#page-prev").removeAttr('disabled');
        }
        if ($scope.page >= $scope.$parent.bookTotalPage) {
            $("#page-next").attr('disabled', 'disabled');
        } else {
            $("#page-next").removeAttr('disabled');
        }
    }

    $scope.items = [];

    var currentItemPage;
    var currentItemBookID;

    function updateItems() {
        if (currentItemPage != $scope.page || currentItemBookID != $scope.$parent.bookID) {
            currentItemPage = $scope.page;
            currentItemBookID = $scope.$parent.bookID;
            $scope.items = [];
            $.get('http://api.linden.pro/book-page/' + String($scope.$parent.bookID) + '/' + String($scope.page), {
                width: $scope.width,
                add_book_page_items: 1,
                add_book_page_words: 0,
                token: $.cookie('token')
            }, function (data) {
                if (data.status == true) {
                    for (var i = 0; i < data.items.length; i++) {
                        $scope.items.push(data.items[i]);
                    }
                    safeApply($scope);
                    setTimeout(function () {
                        editorInit();
                    }, 1);
                } else {
                    error(data, 'Sayfa materyallerinin yüklemesinde problem oluştu.');
                }
            });
        }
    }

    $scope.pageUrl = function (bookID, page, width, token) {
        updateItems();
        return 'http://api.linden.pro/book-page-image-direct/' + bookID + '/' + page + '?width=' + width + '&token=' + $scope.$parent.$parent.token + ''
    };

    function getItemData(item) {

        var editor = $("#editor");
        var image = item.find('.img');

        var dataPx = {};
        dataPx.width = item.width();
        dataPx.height = item.height();
        dataPx.luX = item.offset().left - editor.offset().left;
        dataPx.luY = item.offset().top - editor.offset().top;
        dataPx.rlX = dataPx.luX + dataPx.width;
        dataPx.rlY = dataPx.luY + dataPx.height;

        var dataImagePx = {};
        dataImagePx.width = image.width();
        dataImagePx.height = image.height();
        dataImagePx.luX = image.offset().left - item.offset().left;
        dataImagePx.luY = image.offset().top - item.offset().top;
        dataImagePx.rlX = dataImagePx.luX + dataImagePx.width;
        dataImagePx.rlY = dataImagePx.luY + dataImagePx.height;

        var data = {};
        data.luX = dataPx.luX / editor.width();
        data.luY = dataPx.luY / editor.height();
        data.rlX = dataPx.rlX / editor.width();
        data.rlY = dataPx.rlY / editor.height();

        data.imageFilename = item.attr('data-type') + '.png';
        data.imageLuX = dataImagePx.luX / editor.width();
        data.imageLuY = dataImagePx.luY / editor.height();
        data.imageRlX = dataImagePx.rlX / editor.width();
        data.imageRlY = dataImagePx.rlY / editor.height();

        return data;

    }

    $scope.update = function (itemID) {
        var item = $(".item[data-id=" + String(itemID) + "]");
        data = getItemData(item);
        $.ajax({
            url: 'http://api.linden.pro/book-item/' + String(itemID) + '?token=' + $scope.$parent.$parent.token,
            type: 'PUT',
            dataType: 'json',
            data: data,
            fail: function () {
                error(data, 'Güncelleme sırasında problem oluştu.');
            }
        });
    };

    $scope.add = function (itemIndex) {

        $rootScope.classID = '';
        $rootScope.courseID = '';
        $rootScope.itemID = '';
        $rootScope.search.classID = '';
        $rootScope.search.courseID = '';
        $rootScope.search.title = '';

        $('<div>').dialog({
            open: function () {
                $(this).html($("#item-search").show());
            },
            close: function (e, i) {
                $("#item-search").hide().appendTo("body");
                $(this).remove();
            },
            resizable: true,
            closable: false,
            height: 500,
            width: 750,
            title: 'Materyal Ekle',
            modal: true,
            buttons: {
                'Kaydet': function () {
                    var item = $(".item[data-index=" + String(itemIndex) + "]");
                    var dialog = $(this);
                    var data = getItemData(item);
                    if ($("#item-search #items li.active").length == 0) {
                        Dialog.alert('Hata', 'Lütfen materyal seçin. ');
                    } else {
                        data.itemID = $("#item-search #items li.active").attr('data-item-id');
                        data.bookID = $scope.$parent.bookID;
                        data.page = $scope.page;
                        data.zIndex = 1;
                        $.ajax({
                            url: 'http://api.linden.pro/book-item' + '?token=' + $scope.$parent.$parent.token,
                            type: 'POST',
                            dataType: 'json',
                            data: data,
                            success: function (data) {
                                $scope.items[itemIndex].itemID = data.itemID;
                                $scope.items[itemIndex].ID = data.ID;
                                safeApply($scope);
                                dialog.dialog("close");
                            },
                            fail: function (data) {
                                error(data, 'Materyal ekleme sırasında problem oluştu.');
                            }
                        });
                    }
                },
                'İptal': function () {
                    $scope.items.splice(itemIndex, 1);
                    safeApply($scope);
                    $(this).dialog("close");
                }
            },
            create: function () {
                $(this).closest(".ui-dialog").find("button").addClass("btn");
                $(this).closest(".ui-dialog").find("button:contains(Kaydet)").addClass("btn-primary");
            }
        });
    };

    $scope.edit = function (itemIndex) {

        $rootScope.classID = '';
        $rootScope.courseID = '';
        $rootScope.itemID = $scope.items[itemIndex].itemID;
        $rootScope.search.classID = '';
        $rootScope.search.courseID = '';
        $rootScope.search.title = '';

        $('<div>').dialog({
            open: function () {
                $(this).html($("#item-search").show());
            },
            close: function (e, i) {
                $("#item-search").hide().appendTo("body");
                $(this).remove();
            },
            resizable: true,
            height: 500,
            width: 750,
            title: 'Düzenle',
            modal: true,
            buttons: {
                'Kaydet': function () {
                    var item = $(".item[data-index=" + String(itemIndex) + "]");
                    var dialog = $(this);
                    var data = getItemData(item);
                    if ($("#item-search #items li.active").length == 0) {
                        Dialog.alert('Hata', 'Lütfen materyal seçin. ');
                    } else {
                        data.itemID = $("#item-search #items li.active").attr('data-item-id');
                        data.bookID = $scope.$parent.bookID;
                        data.page = $scope.page;
                        data.zIndex = 1;
                        $.ajax({
                            url: 'http://api.linden.pro/book-item/' + $scope.items[itemIndex].ID + '/' + '?token=' + $scope.$parent.$parent.token,
                            type: 'PUT',
                            dataType: 'json',
                            data: data,
                            success: function (data) {
                                $scope.items[itemIndex].itemID = data.itemID;
                                safeApply($scope);
                                dialog.dialog("close");
                            },
                            fail: function (data) {
                                error(data, 'Materyal düzenlemede problem oluştu.');
                            }
                        });
                    }
                },
                'İptal': function () {
                    $(this).dialog("close");
                }
            },
            create: function () {
                $(this).closest(".ui-dialog").find("button").addClass("btn");
                $(this).closest(".ui-dialog").find("button:contains(Kaydet)").addClass("btn-primary");
            }
        });
    };

    $scope.remove = function (itemIndex) {
        $('<div>').dialog({
            open: function () {
                $(this).html("Bu materyal silinecektir ve bu işlemin geri dönüşü yoktur. <br> Silmek istediğinizden emin misiniz?");
            },
            close: function (e, i) {
                $(this).remove();
            },
            resizable: true,
            height: 200,
            width: 450,
            title: 'Sil Onayı',
            modal: true,
            buttons: {
                'Sil': function () {
                    $.ajax({
                        url: 'http://api.linden.pro/book-item/' + String($scope.items[itemIndex].ID) + '?token=' + $scope.$parent.$parent.token,
                        type: 'DELETE',
                        dataType: 'json',
                        fail: function () {
                            error(data, 'Materyal silmede problem oluştu.');
                        }
                    });
                    $scope.items.splice(itemIndex, 1);
                    safeApply($scope);
                    $(this).dialog("close");
                },
                'İptal': function () {
                    $(this).dialog("close");
                }
            },
            create: function () {
                $(this).closest(".ui-dialog").find("button").addClass("btn");
                $(this).closest(".ui-dialog").find("button:contains(Sil)").addClass("btn-danger");
            }
        });
    };

    $scope.unlock = function (itemIndex) {
        var item = $(".item[data-index=" + String(itemIndex) + "]");
        item.addClass('unlocked');
        editorInit();
    };

    $scope.lock = function (itemIndex) {
        var item = $(".item[data-index=" + String(itemIndex) + "]");
        item.removeClass('unlocked');
        editorInit();
    };

    function editorInit() {

        $(".item.ui-resizable").resizable("destroy");
        $(".item.ui-draggable").draggable("destroy");

        $(".item.unlocked").resizable({
            handles: "all",
            start: function (event, ui) {
                $(this).resizable({
                    maxWidth: ($scope.width - ($(this).offset().left - $("#editor").offset().left)),
                    maxHeight: ($("#editor").height() - ($(this).offset().top - $("#editor").offset().top))
                });
            },
            stop: function (event, ui) {
                $scope.update($(this).attr('data-id'));
            }
        });

        $(".item.unlocked").draggable({
            containment: "parent",
            stop: function (event, ui) {
                $scope.update($(this).attr('data-id'));
            }
        });

        $(".item .img.ui-resizable").resizable("destroy");
        $(".item .img.ui-draggable").draggable("destroy");

        $(".item.unlocked .img").resizable({
            handles: "all",
            start: function (event, ui) {
                $(this).resizable({
                    maxWidth: ($(this).parent().width() - ($(this).offset().left - $(this).parent().offset().left)),
                    maxHeight: ($(this).parent().height() - ($(this).offset().top - $(this).parent().offset().top))
                });
            },
            stop: function (event, ui) {
                $scope.update($(this).parents('.item').first().attr('data-id'));
            }
        });

        $(".item.unlocked .img").draggable({
            containment: "parent",
            stop: function (event, ui) {
                $scope.update($(this).parents('.item').first().attr('data-id'));
            }
        });

        $(".item").disableSelection();

        $("#item-create li.type").draggable({
            helper: function () {
                return $('<div id="item-clone" style="width: 150px; height: 150px; background: rgba(0,0,0,0.5)"><div style="padding: 5px;"> <button class= "btn btn-success btn-mini" ><i class="icon-unlock icon-white"></i></button> <button class= "btn btn-primary btn-mini" ><i class="icon-edit icon-white"></i></button> <button class="btn btn-danger btn-mini"><i class="icon-remove icon-white"></i></button></div></div>').resizable();
            }
        })
        $("#item-create li.type").disableSelection();

        bookPageHeight();
    }

    editorInit();

    $("#editor-holder").droppable({
        drop: function (ev, ui) {
            if ($(ui.draggable).is('li')) {
                var left = $("#item-clone").offset().left - $("#editor").offset().left;
                var top = $("#item-clone").offset().top - $("#editor").offset().top;
                $scope.items.push({
                    luX: left,
                    luY: top,
                    width: 150,
                    height: 150,
                    zIndex: 1,
                    type: $(ui.draggable).attr('data-type'),
                    imageFilename: String($(ui.draggable).attr('data-type') + '.png'),
                    imageLuX: 42,
                    imageLuY: 42,
                    imageWidth: 64,
                    imageHeight: 64,
                    unlocked: true
                });
                $scope.add($scope.items.length - 1);
                safeApply($scope);
                editorInit();
            }
        }
    });

}