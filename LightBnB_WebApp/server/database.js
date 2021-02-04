const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  return pool.query(`
  SELECT * FROM users
  WHERE email = $1
  LIMIT 1;
  `, [email])
  .then((res) => {
    return res.rows[0];
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users
  WHERE id = $1
  LIMIT 1;
  `, [id])
  .then((res) => {
    return res.rows[0];
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  const values = [user.name, user.email, user.password];
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3);
  `, values)
  .then((res) => {
    return res.rows[0];
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);
  return pool.query(`
  SELECT * FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  WHERE (guest_id = $1) AND (start_date > now()::date)
  LIMIT $2;
  `, [guest_id, limit])
  .then((res) => {
    console.log(res.rowCount);
    return res.rows;
  });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


// helper functions
const checkModifications = function(modified) {
  if (modified) {
    return 'AND';
  } else {
    return 'WHERE';
  }
}

// for debugging only
const printQuery = function(queryString, queryParams) {
  let newString = queryString;
  let varCount = 0;
  while (newString.includes('$')) {
    // console.log('running');
    varCount++;
    if (typeof(queryParams[varCount - 1]) === 'number') {
      newString = newString.replace(`$${varCount}`, queryParams[varCount - 1]);
    } else {
      newString = newString.replace(`$${varCount}`, `'${queryParams[varCount - 1]}'`);
    }
  }
  // PRINT THE QUERY
  console.log('------------------------ QUERY START');
  console.log(newString.split('  ').join('')); // REMOVE EXTRA SPACES
  console.log('------------------------ QUERY END');
};

const getAllProperties = function(options, limit = 10) {
  let modifications = false;
  let queryParams = [];
  let queryString = `SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON property_reviews.property_id = properties.id\n`;

  // START DYNAMIC QUERY
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `${checkModifications(modifications)} owner_id = $${queryParams.length}\n`;
    modifications = true;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `${checkModifications(modifications)} cost_per_night >= $${queryParams.length}\n`;
    modifications = true;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `${checkModifications(modifications)} cost_per_night <= $${queryParams.length}\n`;
    modifications = true;
  }

  if (options.city) {
    const target_city = `%${options.city}%`;
    queryParams.push(target_city);
    queryString += `${checkModifications(modifications)} city like $${queryParams.length}\n`;
    modifications = true;
  }
  
  // END DYNAMIC QUERY
  queryString += `GROUP BY properties.id\n`;

  // HAVING clause must be after group by
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}\n`;
  }

  limit = 10;
  queryParams.push(limit);
  queryString += `LIMIT $${queryParams.length};`;
  
  printQuery(queryString, queryParams);
  
  return pool.query(queryString, queryParams)
  .then((res) => {
    return res.rows;
  });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
  let queryString = `
  INSERT INTO properties (
    owner_id, 
    title, 
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    parking_spaces,
    number_of_bathrooms, 
    number_of_bedrooms,
    country,
    street,
    city,
    province,
    post_code
    )
  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;

  let queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ];

  printQuery(queryString, queryParams);
  return pool.query(queryString, queryParams)
  .then((res) => {
    return res.rows[0];
  });
}
exports.addProperty = addProperty;
