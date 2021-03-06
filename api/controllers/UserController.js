/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var Emailaddresses = require('machinepack-emailaddresses');
var Passwords = require('machinepack-passwords');
var Strings = require('machinepack-strings');

module.exports = {

  login: (req, res) => {
    User.findOne({
      email: req.param('email'),
    })
    .exec((err, user) => {
      if (err) {
        sails.log.error(err);
        return res.badRequest(err);
      }
      if (!user) {
        return res.notFound();
      }

      Passwords.checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: user.encryptedPassword,
      }).exec({
        error: (err) => {
          sails.log.error(err);
          return res.badRequest(err);
        },

        incorrect: () => {
          return res.notFound();
        },

        success: () => {
          if (user.deleted) {
            return res.forbidden('Your account has been deleted.');
          }

          req.session.userId = user.id;

          return res.ok({
            userId: user.id,
            username: user.email,
            admin: user.admin,
          });
        }
      });
    });
  },

  logout: (req, res) => {
    User.findOne(req.session.userId, (err, user) => {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.redirect('/');
      }

      req.session.userId = null;

      return res.ok();
    });
  },

  getUsers: (req, res) => {
    User.count().exec((err, numberOfUsers) => {
      if (err) { return res.negotiate(err); }
      if (!numberOfUsers) { return res.notFound(); }

      User.find({
        limit: 10,
        skip: req.param('skip'),
      })
      .exec((err, foundUsers) => {
        if (err) { return res.serverError(err); }

        return res.json({
          total: numberOfUsers,
          data: foundUsers,
        });
      });
    });
  },

  getUser: (req, res) => {
    User.findOne({
      id: req.param('id'),
    }).exec((err, user) => {
      if (err) {
        return res.serverError(err);
      }

      if (!user) {
        return res.notFound();
      }

      return res.json({
        id: user.id,
        email: user.email,
        admin: user.admin,
      });
    });
  },
};
