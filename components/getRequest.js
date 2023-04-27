const getData = (url, sessionToken, success, failure) => fetch(url, {
  method: 'get',
  headers:
              {
                'Content-Type': 'application/json',
                'X-Authorization': sessionToken,
              },
})
  .then((response) =>
  {
    if (response.status === 200)
    {
      return response.json();
    }

    throw response.status;
  })
  .then((resJson) =>
  {
    success(resJson);
  })
  .catch((err) =>
  {
    failure(err);
  });

export default getData;
