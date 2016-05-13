(function () {
  'use strict';

  angular
    .module('downloads')
    .controller('DownloadsListController', DownloadsListController);

  DownloadsListController.$inject = ['DownloadsService', 'Authentication'];

  function DownloadsListController(DownloadsService, Authentication) {
    var vm = this;

    vm.downloads = DownloadsService.query();
    vm.authentication = Authentication;
    vm.remove = remove;

    function remove (download) {
      if (download) {
        for (var i in vm.downloads) {
          if (vm.downloads[i] === download) {
            download = new DownloadsService(vm.downloads[i]);
            download.$remove();
            vm.downloads.splice(i, 1);
          }
        }
      }
    }
  }
}());
