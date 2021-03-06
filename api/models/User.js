/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    email: {
      type: 'string',
      isEmail: true,
      unique: true,
      required: true,
    },

    admin: {
      type: 'boolean',
      defaultsTo: false,
    },

    encryptedPassword: {
      type: 'string',
    },

    deleted: {
      type: 'boolean',
    },

    store: {
      model: 'store',
    },
  },

};
