const BASE_URL = "https://localhost:44305/api";

// let authorizationToken = "Bearer " + localStorage.getItem("token");
export const getRequest = async (
  url,
  queryParams = "",
  isAuthorizationReqd = false,
  body = null
) => {
  const response = await fetch(
    `${BASE_URL}${url}` + new URLSearchParams(queryParams),
    {
      headers: {
        Authorization: isAuthorizationReqd
          ? `Bearer ${localStorage.getItem("token")}`
          : null,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body,
    }
  )
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      return result;
    });

  return response;
};

export const postRequest = async (
  url,
  queryParams = "",
  isAuthorizationReqd = false,
  body = null
) => {
  const response = await fetch(
    `${BASE_URL}${url}` + new URLSearchParams(queryParams),
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: isAuthorizationReqd
          ? `Bearer ${localStorage.getItem("token")}`
          : null,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    });
  return response;
};

export const patchRequest = async (
  url,
  queryParams = "",
  isAuthorizationReqd = false,
  body = null
) => {
  const response = await fetch(
    `${BASE_URL}${url}` + new URLSearchParams(queryParams),
    {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        Authorization: isAuthorizationReqd
          ? `Bearer ${localStorage.getItem("token")}`
          : null,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => err);

  return response;
};

export const putRequest = async (
  url,
  queryParams = "",
  isAuthorizationReqd = false,
  body = null
) => {
  const response = await fetch(
    `${BASE_URL}${url}` + new URLSearchParams(queryParams),
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        Authorization: isAuthorizationReqd
          ? `Bearer ${localStorage.getItem("token")}`
          : null,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((err) => console.log(err));

  return response;
};

// const response = await fetch(
//       "https://localhost:44305/api/admin/update-roles",
//       {
//         method: "PUT",
//         body: JSON.stringify({
//           userName: targetUser,
//           roles: currentRoles,
//         }),
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("token"),
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       }
//     )
//       .then((response) => response.json())
//       .then((json) => {
//         console.log(json);
//         return json;
//       })
//       .catch((err) => console.log(err));
