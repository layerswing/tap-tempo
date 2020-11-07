/*
https://github.com/livejs/tap-tempo/issues/1
maciejsaw opened this issue on Apr 8, 2017 · 0 comments
maciejsaw commented on Apr 8, 2017
Hi, I was about to use your snippet, but it turned out to calculate bpm totally wrong after only 2 taps.
I ended up rewriting this so that it can calculate the bpm even after 2 taps only.
I paste here the code in case you want to update you snippet in similar way
*/

var TapTempo = (function(){

  var listOfTapDates = [];
  var listOfTapsDelays = [];
  var triggerTimer;

  var pushDate = function() {
    listOfTapDates.push(Date.now());
  };

  var pushDelay = function() {
    $.each(listOfTapDates, function(index, value) {
      if (index > 0) {
        var thisTapDate = value;
        var previousTapDate = listOfTapDates[index - 1];
        var delayAfterPreviousTap = thisTapDate - previousTapDate;

        listOfTapsDelays.push(delayAfterPreviousTap);
      }
    });
  };  

  var getAvgFromArray = function(array) {
    var sum = array.reduce(function (p, c) {
      return p + c;
    });

    var avg = sum / array.length;

    return avg;
  }

  var calculateResultBpm = function() {
    var averageDelayBetweenTaps = getAvgFromArray(listOfTapsDelays);
    var numberOfMillisecondsInMinute = 60000;
    var resultBpm = (numberOfMillisecondsInMinute/averageDelayBetweenTaps);
    return resultBpm;
  }

  var resetAllGatheredTappingData = function() {
     listOfTapDates = [];
     listOfTapsDelays = [];
  };
  
  var triggerCalculation = function() {
    clearTimeout(triggerTimer);

    pushDate();

    if (listOfTapDates.length > 1) {
      pushDelay();
      var resultBpm = calculateResultBpm();
      $(document).trigger('tempoSetByTapping', resultBpm)
    }

    triggerTimer = setTimeout(function() {
        resetAllGatheredTappingData();
    }, 2000);
  }

  return {
    triggerCalculation: triggerCalculation
  }

})();

//example
//note that it's attached to mousedown, not click , because click is mousedown + mouseup, which is not accurate to tap tempo
$(document).on('mousedown touchstart', '[action-tap-tempo]', function() {
  TapTempo.triggerCalculation();
});

$(document).on('tempoSetByTapping', function(event, bpm) {
  //set tempo to bpm
  ReactiveLocalStorage.setParam('tempo', bpm);
});
