// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('srh', ['ionic','firebase', 'srh.controllers', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, $ionicHistory, $ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function(event) {

  if ($state.current.name == "app.home" || $state.current.name == "app.bookmarks" || $state.current.name == "app.settings") {

    $ionicPopup.confirm({
    template: 'App will be minimized to background',
    title: '<b>SRH Blogs</b>',
    subTitle: 'Minimize App',
    okText: 'Minimize',
    okType: 'button-balanced',
    cancelType: 'button-assertive'
  }).then(function(res) {
    if(res)
    {
    
     window.plugins.appMinimize.minimize();
   
  } //end of if res
  
  });

} //end if $state

else if ($state.current.name == "startScreen" || $state.current.name == "login") {

    $ionicPopup.confirm({
    template: 'Do you want to Exit SRH Blogs?',
    title: '<b>SRH Blogs</b>',
    subTitle: 'Exit App',
    okText: 'Exit',
    okType: 'button-assertive',
    cancelType: 'button-balanced'
  }).then(function(res) {
    if(res)
    {
    
     ionic.Platform.exitApp();
   
  } //end of if res
  
  });

} //end else if $state
   
  else
  {
    $ionicHistory.goBack();
  }



  }, 100); // end of registerBackButtonAction
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaInAppBrowserProvider) {
  $stateProvider

  .state('startScreen',{
    url: '/start',
    templateUrl: 'templates/start.html',
    controller: 'startCtrl',
    cache:false
  })

  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl',
    cache:false
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl',

        }
      }
    })

  .state('app.bookmarks', {
    url: '/bookmarks',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarks.html',
        controller: 'bookCtrl',
        cache: false
      }
    }
  })

  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html',
          controller: 'aboutCtrl'
        }
      }
    })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'settingsCtrl'
        }
      }
    })
    
   $ionicConfigProvider.views.transition('ios');
   $ionicConfigProvider.navBar.alignTitle('center');

   var defaultOptions = {
    location: 'no',
    clearcache: 'no',
    toolbar: 'no'
  };

  document.addEventListener("deviceready", function () {

    $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions)

  }, false);
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start');
});
