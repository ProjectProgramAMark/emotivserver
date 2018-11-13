/*
* These are just scraps of code that are no longer needed but may prove to be useful
*/


        //   console.log("successfully queried sessions: ");
        //   console.log(res);
        //   console.log("closing sessions");
        //   // making sure all sessions are closed before opening a new one
        //   var closePreviousSessions = function() {
        //     return new Promise(function(resolve, reject) {
        //     if(res.length > 0) {
        //       for (var i = 0; i < res.length; i++) {
        //         var sessionID = res[i].id;
        //         console.log(res[i].id);
        //         if(res[i].status != 'closed') {
        //           client.updateSession({ session: sessionID, status: "close" })
        //           .then((res) => {
        //             console.log("successfully closed session: ", res.id);
        //           }, (err) => {
        //             // console.log("error in closing session ", sessionID, ": ", err);
        //             reject("error in closing session", sessionID, ": ", err);
        //           })
        //         }
        //       }
        //       resolve('Successfully closed all sessions');
        //     } else {
        //       resolve('No sessions present');
        //     }
        //   });
        // }

// 
// .then((res) => {
//   client.updateSession({ session: res.id, status: "closed" })
//   .then((res) => {
//     console.log("session is now closed");
//   }, (err) => {
//     console.log("error closing session");
//   })
// })
