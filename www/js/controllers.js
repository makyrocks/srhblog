angular.module('srh.controllers', [])

.controller('AppCtrl', function($scope, $ionicPlatform, $timeout, $state, $ionicLoading, $firebaseAuth) {

$scope.logout = function()
{
  
 $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Please Wait...</center>',
                  hideOnStateChange: true
                });
  
    $scope.signoutObj = $firebaseAuth();
    $scope.signoutObj.$signOut();
    $timeout(function(){
      $ionicLoading.hide();
      $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Restart App...</center>',
                  hideOnStateChange: true
                });
    ionic.Platform.exitApp();
    },1500);


}//end of logout function
  
})



.controller('homeCtrl', function($scope, $cordovaSocialSharing, $ionicPopup, $firebaseArray, $firebaseAuth, $ionicLoading, $cordovaInAppBrowser, $state) {

$scope.initial = function(){
$ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Loading...</center>',
                  noBackdrop: true,            
                });

var auth = $firebaseAuth().$getAuth();

if(auth)
{
var ref = firebase.database().ref().child("blogs");
var obj = $firebaseArray(ref);

obj.$loaded().then(function(data){
  $scope.blogs = data;
  $ionicLoading.hide();
}).catch(function(error){
  console.log(error);
})
}

else {
  $ionicLoading.hide();
   $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Please login...</center>',
                  noBackdrop: true,
                  duration: 2000
                });
  $state.go('startScreen');
}

}


$scope.browse = function(v){

 var linkPopUp = $ionicPopup.show({
    template: '<button class="button button-block icon-right ion-university button-balanced" ng-click="openInApp()">Open In App</button><button class="button icon-right ion-android-share button-block button-positive" ng-click="external()">External Browser</button><button class="button button-block button-assertive icon-right ion-close" ng-click="closePopup()">Close</button>',
    title: 'Open Link',
    subTitle: v,
    scope: $scope,
    
  });

 /* myPopup.then(function(res) {
    console.log('Tapped!', res);
  });*/
$scope.closePopup = function() {
  linkPopUp.close();
}
$scope.external = function (){
  linkPopUp.close();
  window.open(v, "_system", "location=yes");
}

  $scope.openInApp = function(){
    linkPopUp.close();
  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

  document.addEventListener("deviceready", function () {
    $cordovaInAppBrowser.open(v, '_blank', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
        $cordovaInAppBrowser.close();
      });


    

  }, false);
}

}

$scope.bookMark = function (_blog) {
$ionicLoading.show({
      template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Saving...</center>'
    });

var auth = $firebaseAuth().$getAuth();
var ref = firebase.database().ref().child(auth.uid).child("bookmarks");
var obj = $firebaseArray(ref);

var book = $firebaseArray(ref);
      book.$add({
        link : _blog.link,
        pubdate : _blog.pubdate,
        author : _blog.author,
        title : _blog.title,
        snippet: _blog.snippet,
        report: _blog.report
      }).then(function(ref){ 
         $ionicLoading.hide();
         $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Bookmark Added</center>',
      duration: 1500
    });
        
      }, function(error){

        $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>' + error + '</center>',
      duration: 2000
    });
      })//end of then



}

$scope.social = function(link)
{
  $cordovaSocialSharing.share(link) // Share via native share sheet
    .then(function(result) {
      // Success!
      console.log(result);
    }, function(error) {
      // An error occured. Show a message to the user
      console.log(error);
      $ionicLoading.show({template: 'Facebook is not installed. Please install facebook',
        duration: 1500});
    });
}

})

.controller('startCtrl', function ($scope, $timeout, $state, $firebaseAuth, $ionicLoading){

  $scope.delay = function(){

    var myText = new SplitText("#textstart", {type:"chars"});
   var welcome = new TimelineMax({onComplete:homeview});
   
TweenLite.set("#textstart", {perspective:800, opacity:0});
//TweenLite.set("#SRHlogo")
welcome.staggerFromTo("#SRHlogo", 2, {opacity:0, scale:1, rotationY:-270, color:"#242f24"}, {opacity:1, scale:1, rotationY:0, color:"#FFFFFF"});
welcome.set("#textstart", {opacity:1});
welcome.staggerFromTo(myText.chars, 1, {opacity:0, scale:1, rotationY:-270, color:"#242f24"},{opacity:1, scale:1, rotationY:0, color:"#FFFFFF"},0.25);
welcome.to("#SRHlogo", 0.8, {color:"#242f24"},'-=1.8');
welcome.to("#SRHlogo", 0.9, {color:"#FFFFFF"}, '-=1.5');

function homeview (){

$ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Please Wait...</center>',
                  hideOnStateChange: true
                });

  var auth = $firebaseAuth().$getAuth();
  
  if(auth)
  {

    $state.go('app.home');
  }

  else
  {
    $ionicLoading.hide();
  $timeout (function(){

    $scope.showFooter = true;
  },400);
  }

}


  }

})

.controller('bookCtrl', function($scope, $state, $firebaseAuth, $firebaseArray, $ionicLoading, $ionicPopup) {

$scope.showMarks = function(){

$ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Loading...</center>',
                  noBackdrop: true,            
                });

var auth = $firebaseAuth().$getAuth();

if(auth)
{
var ref = firebase.database().ref().child(auth.uid).child("bookmarks");
var obj = $firebaseArray(ref);

obj.$loaded().then(function(data){
  $scope.marks = data;
  $ionicLoading.hide();
}).catch(function(error){
  console.log(error);
})
}

else {
  $ionicLoading.hide();
   $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Please login to view bookmarks...</center>',
                  noBackdrop: true,
                  duration: 2000
                });
  $state.go('login');
}

   
}

$scope.removeMark = function(_mark)
{
  
var confirmDelete = $ionicPopup.confirm({
  title: 'Bookmarks',
  template : 'Are you sure you want to remove bookmark?',
  cancelType : 'button-balanced',
  okType : 'button-assertive'
});

var fbAuth = $firebaseAuth().$getAuth();
if(fbAuth)
{
  var ref = firebase.database().ref().child(fbAuth.uid).child("bookmarks");
  var obj = $firebaseArray(ref);

  obj.$loaded().then(function(x){
    x === obj;
    var i = obj.$indexFor(_mark);
    var item = obj[i];
    console.log(i,item);
    // A confirm dialogue box

    confirmDelete.then(function(res) {

    if(res) {
  obj.$remove(item).then(function(ref){ 
  }, function(error){
    $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>' + error + '</center>',
      duration: 2000
    });

  })//end of $remove function

}

else{
 $state.go("app.bookmarks");
}

})//end of then for confirm popup

})//End of then for $loaded
  .catch(function(error){
    
    $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>' + error + '</center>',
      duration: 2000
    });
    
  });
  
}//End of fbAuth if

else
{
  $state.go('login');
}

}



})

.controller('loginCtrl', function($scope, $firebaseAuth, $ionicPopup, $ionicLoading, $ionicPopup, $state) {

$scope.login = function (_credentials)
            {
        //ionicLoading is the loading msg that is shown while authentication check happens in background
        //there by, blocking the user from any other action during authentication process.
        //icon in spinner and class change the icon and the color of spinner refer ionic docs for more spinner icons.
        if (_credentials)
        {
                $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Logging in... Please Wait</center>',
                  noBackdrop: true
                });

        // firebaseAuth takes AUTHREF(see app.js) as the paramenter and the firebase service authWithPassword to authenticate users.
        // authWithPassword takes email and password as JSON strings {email: , password: }
                $scope.signInObj = $firebaseAuth();
                $scope.signInObj.$signInWithEmailAndPassword(_credentials.email,_credentials.password)
                .then(function (firebaseUser)
                {
                        //Do things if successful
                        console.log("Logged in as:", firebaseUser.uid);

                        //hide ionicloading after successful authentication
                        $ionicLoading.hide();

                        $ionicLoading.show(
                        {
                template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Login Successful!</center>',
                noBackdrop: true,
                duration: 1500
                        });
                        //use $state service to go to home screen
                        $state.go('app.home', {});

                }).catch(function(error)
                {

                        //if authentication error then hide ionicloading
                        $ionicLoading.hide();
                        console.error("Authentication failed:", error);
                        //display the error msg returned from firebase.
                        $ionicLoading.show(
                        {
                template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>' + error.message + ' Login Failed!</center>',
                noBackdrop: true,
                duration: 2500
                        });
                });
              }
              else
              {
                $ionicLoading.show({
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center> Please Provide E-mail/Password</center>',
                  duration: 1500,
                  noBackdrop: true
                })
              }
            }//end of login function

            /*Forgot email function*/
$scope.forgot = function (){
  $scope.data ={fmail:null};
var forgotPopup = $ionicPopup.show({
    template: '<label class="item item-input"><span class="input-label">Email</span><input type="email" ng-model="data.fmail" Placeholder="Enter E-mail Address"></label>',
    title: 'Forgot Password?',
    subTitle: 'Enter your E-mail used to register',
    scope: $scope,
    buttons: [
      { text: 'Cancel',
        type: 'button-assertive'},
      {
        text: 'Send',
        type: 'button-balanced',
        onTap: function(e) {
          return $scope.data;
          
        }
      }
    ]
  }); //end of popup declaration

forgotPopup.then(function(res) {
  //First show a loading overlay to prevent further actions. with a please wait msg
     $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-calm" icon="lines"></ion-spinner><br>Please Wait...</center>',

                });

    if(res == undefined)
    {
      forgotPopup.close();
      $ionicLoading.hide();
      
    } //end of if


    else
    {
$scope.forgotObj = $firebaseAuth();
$scope.forgotObj.$sendPasswordResetEmail($scope.data.fmail).then(function(){
                 $ionicLoading.hide();
                 $ionicLoading.show(
                {
                  template: '<center>An email has been sent to ' +$scope.data.fmail+ '<br>Please follow the instruction to reset password.</center>',
                  duration: 4000  
                });
                 

                }).catch(function(error){
                  $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-calm" icon="lines"></ion-spinner><br>' +error.message+ '</center>',
                  duration: 2000  
                });
                  
                })



    }
    




  });


}//end of forgot function

$scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Create Account',
     subTitle: 'Error',
     template: '<center><span class="assertive">Certain fields are missing.<br>Please try again.</span></center>',
     okType: 'button-balanced',
   });

 }//end of show alert function

 $scope.mismatchAlert = function ()
 {
  var alertPopup = $ionicPopup.alert({
     title: 'Create Account',
     subTitle: 'Error',
     template: '<center><span class="assertive">Password Mismatch<br> Please try again.</span></center>',
     okType: 'button-balanced',
   });
 }

$scope.register = function() {

 $scope.acc = {email:null,pass:null, rpass:null, noData:null};

 var addPopup = $ionicPopup.show({
    templateUrl: 'templates/popups/addAcct.html',
    title: 'Create Account',
    subTitle: 'Sign up for a new account',
    scope: $scope,
    buttons: [
      { text: 'Cancel',
        type: 'button-assertive'},
      {
        text: 'Sign Up',
        type: 'button-balanced',
        onTap: function() {
          if (!$scope.acc.email || !$scope.acc.pass || !$scope.acc.rpass ) {
            //don't allow the user to close unless he enters wifi password
            $scope.acc.noData = true;
            $scope.showAlert();
          }

          else if ($scope.acc.pass != $scope.acc.rpass)
        {
          $scope.acc.noData = true;
            $scope.mismatchAlert();
          
        }

          else 
          {
           $scope.acc.noData = false; 
          return $scope.acc;
        }

        

        }
      }
    ]
  }) //end of popup declaration

 addPopup.then(function(res){
    
    if($scope.acc.noData == false)
    {

$scope.signupObj = $firebaseAuth();

               $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner></center><br><center>Signing Up... Please Wait</center>',
    });

//firebaseAuth takes AUTHREF(see app.js) as the paramenter and the firebase service createUser to create a user in firebase.
// createUser takes email and password as JSON strings {email: , password: }
            //var authObj = $firebaseAuth(AUTHREF);

            $scope.signupObj.$createUserWithEmailAndPassword(res.email, res.pass).then(function(firebaseUser) {
                        //Do things if successful. Authenticate user and direct him to tour wizard
                        return $scope.signupObj.$signInWithEmailAndPassword(res.email, res.pass);

                        //console.log('User creation success', userData.uid);

                        
                       

                    }).then(function(firebaseUser){
                      //use $state service to go to tour screen.
                      //hide ionicloading after successful registration
                       $ionicLoading.hide();
                        $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-calm" icon="lines"></ion-spinner></center><br><center>Sign Up Successful...</center>',
      duration: 1500
    });
                        $state.go('app.home',{});
                         
                    }).catch(function(error) { //catch error for creating a user.

                        // do things if failure
                         $ionicLoading.hide();

                        //console.error("Unable to create user", error);

                        $ionicLoading.show({
      template: '<center><ion-spinner class="spinner-calm" icon="lines"></ion-spinner></center><br><center>' + error.message + ' Sign Up Failed!</center>',
      duration: 2500
    });
                    });





    }


  })


} // end of register function    



})

.controller('settingsCtrl', function($scope, $state, $firebaseAuth, $firebaseArray, $ionicLoading, $ionicPopup) {

$scope.changeEmail = function()
{

    $scope.data = {email:null};

  // An elaborate, custom popup
  var emailPopup = $ionicPopup.show({
    template: '<label class="item item-input"><span class="input-label">New Email*</span><input type="email" ng-model="data.email" required="yes"></label>',
    title: 'Change Login Email',
    subTitle: 'This action will change your login email id',
    scope: $scope,
    buttons: [
      { text: 'Cancel', 
      type:'button-assertive'},
      {
        text: 'Update',
        type: 'button-balanced',
        onTap: function(e) {
          if (!$scope.data.email) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });

  

  emailPopup.then(function(res) {
    
    //First show a loading overlay to prevent further actions. with a please wait msg
    $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner><br>Working...</center>',
                  
                });

    if(res == undefined)
    {
      emailPopup.close();
      $ionicLoading.hide();
      
    } //end of if

    else {
      

      var fbAuth = $firebaseAuth().$getAuth();
  var authObj = $firebaseAuth();
  
    authObj.$updateEmail($scope.data.email).then(function() {
      //once email changed successfully close the previous loading and open a new one
      $ionicLoading.hide();
$ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner><br>Email Updated...</center>',
                  duration: 2000
                });

}).catch(function(error) {
  $ionicLoading.hide();
  $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ios"></ion-spinner><br>'+error.message+'</center>',
                  duration: 3500
                });
  
}); //end of $changeEmail

 }//end of else 

  }); //end of then for emailPopup

  
}//end of function

$scope.changePass = function (){

 $scope.mismatchAlert = function() {
   var passMismatchAlert = $ionicPopup.alert({
     title: 'Password Mismatch',
     template: 'Please Try Again',
     okType: 'button-balanced'
   });
   passMismatchAlert.then(function(){ 
   $scope.changePass();
   })
 }

$scope.data = {npass:null, rpass:null};

  // An elaborate, custom popup
  var passPopup = $ionicPopup.show({
    template: '<div class="list card"><label class="item item-input item-floating-label"><span class="input-label">New Password</span><input type="password" ng-model="data.npass" Placeholder="New Password" required="yes"></label><label class="item item-input item-floating-label"><span class="input-label">Confirm Password</span><input type="password" ng-model="data.rpass" Placeholder="Confirm Password" required="yes"></label></div>',
    title: 'Change Password',
    subTitle: 'This action will change your login password',
    scope: $scope,
    buttons: [
      { text: 'Cancel', 
      type:'button-assertive'},
      {
        text: 'Update',
        type: 'button-balanced',
        onTap: function(e) {
          if (!$scope.data.npass || !$scope.data.rpass) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });

  

  passPopup.then(function(res) {
    
    //First show a loading overlay to prevent further actions. with a please wait msg
    $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner><br>Updating...</center>',
                  
                });

    if(res == undefined)
    {
      passPopup.close();
      $ionicLoading.hide();
      
    } //end of if

    else {
      if($scope.data.npass == $scope.data.rpass)
      {
  
  var authObj = $firebaseAuth();
  authObj.$updatePassword($scope.data.npass).then(function() {
  console.log("Password changed successfully!");
  $ionicLoading.hide();
  $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner><br>Password Changed Successfully</center>',
                  duration: 2000
                });
}).catch(function(error) {
  console.error("Error: ", error);
  $ionicLoading.show(
                {
                  template: '<center><ion-spinner class="spinner-balanced" icon="ripple"></ion-spinner><br>'+error+'</center>',
                  duration: 2000
                });
                $state.go('login');
});

    

} //end of if for password match

else {
  $ionicLoading.hide();
$scope.mismatchAlert();

}

} // end of else

})//end of passPopup then function

}//end of change password function

$scope.goToAbout = function(){
  $state.go('app.about');
}

})  

.controller('aboutCtrl', function($scope){

  $scope.aboutAnim = function (){
  var myText = new SplitText("#textstart", {type:"chars"});
   var welcome = new TimelineMax();
   
TweenLite.set("#textstart", {perspective:800, opacity:0});
//TweenLite.set("#SRHlogo")
welcome.staggerFromTo("#SRHlogo", 2, {opacity:0, scale:1, rotationY:-270, color:"#242f24"}, {opacity:1, scale:1, rotationY:0, color:"#FFFFFF"});
welcome.set("#textstart", {opacity:1});
welcome.staggerFromTo(myText.chars, 0.8, {opacity:0, scale:1, rotationY:-270, color:"#242f24"},{opacity:1, scale:1, rotationY:0, color:"#FFFFFF"},0.09);
welcome.to("#SRHlogo", 0.8, {color:"#242f24"},'-=1.6');
welcome.to("#SRHlogo", 0.9, {color:"#FFFFFF"}, '-=1.3');
welcome.from("#designText", 0.8, {opacity:0, x:-100});



  }

})