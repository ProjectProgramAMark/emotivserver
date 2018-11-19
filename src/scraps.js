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


// subscribing to pow data
// client.subscribe({ streams: ["pow"], session: session })
// .then((res) => {
//   console.log("successfully subscribed to pow");
//   console.log(res);
// }, (err) => {
//   console.log("error subscribing to pow");
//   console.log(err);
// })



// making sure all sessions are closed before opening a new one
// function closePreviousSessions() {
//   return new Promise(function(resolve, reject) {
//     console.log("res.length is: ", res.length);
//   if(res.length > 0) {
//     for (var i = 0; i < res.length; i++) {
//       var sessionID = res[i].id;
//       console.log(res[i].id);
//       if(res[i].status != "closed") {
//         console.log("updating session status to closed");
//         client.updateSession({ session: sessionID, status: "closed" })
//         .then((res) => {
//           console.log("successfully closed session: ", res.id);
//         }, (err) => {
//           // console.log("error in closing session ", sessionID, ": ", err);
//           reject("error in closing session", sessionID, ": ", err);
//         })
//       }
//     }
//     resolve('Successfully closed all sessions');
//   } else {
//       resolve('No sessions present');
//     }
//   });
// }




//
// // getting mental command action level sensitivity
// client.mentalCommandActionLevel({ profile: "chris", status: "get" })
// .then((res) => {
//   console.log("mental command action level sensitivity result: ");
//   console.log(res);
// })
// // getting mental command action level actions
// client.mentalCommandActiveAction({ profile: "chris", status: "get" })
// .then((res) => {
//   console.log("mental command action level actions result: ");
//   console.log(res);
// })


// const comObject = Object.assign({}, ...res);
// console.log(comObject);
// console.log("comObject.com: ", comObject.com);
// console.log("cols act: ", comObject.com.cols[0]);
// console.log("res.com.cols: ", res[0].com.cols);
