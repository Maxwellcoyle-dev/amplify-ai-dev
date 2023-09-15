//   function to fetch from our backend and update the users array
//   const fetchUsers = async (e) => {
//     console.log(e);
//     const user = await Auth.currentAuthenticatedUser();
//     const token = user.signInUserSession.idToken.jwtToken;
//     console.log("token: ", token);

//     const requestData = {
//       headers: {
//         Authorization: token,
//       },
//     };

//     API.get(myAPI, path + "/" + e.input, requestData).then((response) => {
//       console.log(response);
//       setUser(response.userId);
//     });
//   };
