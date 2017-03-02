'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const fetch = require('node-fetch');

module.exports = async (url, data) => {
  data = JSON.stringify(data);

  const res = await fetch(`${url}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });

  return await res.json();
};
