
// controller.js 
var app = angular.module('myApp', []);


app.controller('gameCtrl', function ($scope, $http, $timeout) {

  //Random number of images
  $scope.n = Math.floor(Math.random()*(12-6+1)+6);
  //Variable to store the matches
  $scope.win = 0;

  var file = 'words.json';
    $http.get(file).success(function(data) {
      //Selection of 'n' sequential images
      prewords = data.data.slice(0,$scope.n);
      //'ver' & 'verimage' will allow us show and hide images and phrase when matching
      for (var i = prewords.length - 1; i >= 0; i--) {
        prewords[i].ver = true;
        prewords[i].verimage = false;
      }

      //Duplicating the images selected
      prewords2 = JSON.parse(JSON.stringify(prewords));     
      $scope.words = prewords.concat(prewords2);

      //Generate random order
      for (var i = $scope.words.length - 1; i >= 0; i--) {
        $scope.words[i].order = Math.random();
      } 
    });

    //Function to show the image when tap on a opaque tile
    $scope.mostrar = function(data){

      //If there any other image visible, take it as reference
      if(localStorage.getItem("ref")){
        ref = JSON.parse(localStorage.getItem("ref"));

        //If the image tapped is the same as the reference one 
        if(data.phrase == ref.phrase){
          localStorage.removeItem("ref");
          data.verimage = true;
          $scope.match = true;
          $scope.isDisabled = true; //This allows us to prevent opening more than two images
          $scope.win++;

          //(With Delay) Hide both images, show the phrases and hide 'match' message
           $timeout(function(){
            for (var i = $scope.words.length - 1; i >= 0; i--) {
              if($scope.words[i].phrase == ref.phrase){
                $scope.words[i].ver = false;
              }
            }
            $scope.match = false;
            $scope.isDisabled = false;

            //If we matched all the images. Game over and Play again!
            if($scope.win == $scope.n){
              $scope.playagain = true;
            }

          }, 800);

        }else{
          localStorage.removeItem("ref");
          data.verimage = true;
          $scope.nomatch = true;
          $scope.isDisabled = true;
          
          //(With Delay) Hide both images and hide 'nomatch' message.
          $timeout(function(){
            for (var i = $scope.words.length - 1; i >= 0; i--) {
              if($scope.words[i].phrase == ref.phrase){
                $scope.words[i].verimage = false;
              }
            }
            data.verimage = false;
            $scope.nomatch = false;
            $scope.isDisabled = false;
          }, 800);
          
        }
      }
      else{
        // There no other image visible, take this image as future reference
        $scope.match = false;
        $scope.nomatch = false;
        data.verimage = true;
        localStorage.setItem("ref", JSON.stringify(data));
      }

    }

    //Tap on a opened tile, hide the image with no message and delete the reference stored
    $scope.ocultar = function(data){
      data.verimage = false;
      localStorage.removeItem("ref");
    }



 });//Fin del controlador

