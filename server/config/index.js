const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

module.exports = app => {
  app.use(express.json());

  app.use(cors());

  app.options('*', cors());

  app.use(express.static(path.join(__dirname, '../public')));

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
};
