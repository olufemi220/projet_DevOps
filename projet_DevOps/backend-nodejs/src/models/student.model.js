const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'first_name',
    validate: {
      notEmpty: { msg: 'Le prénom est obligatoire' },
      len: {
        args: [2, 50],
        msg: 'Le prénom doit contenir entre 2 et 50 caractères'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'last_name',
    validate: {
      notEmpty: { msg: 'Le nom est obligatoire' },
      len: {
        args: [2, 50],
        msg: 'Le nom doit contenir entre 2 et 50 caractères'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'L\'email est obligatoire' },
      isEmail: { msg: 'L\'email doit être valide' }
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'date_of_birth',
    validate: {
      notEmpty: { msg: 'La date de naissance est obligatoire' },
      isDate: { msg: 'La date de naissance doit être valide' },
      isBefore: {
        args: new Date().toISOString().split('T')[0],
        msg: 'La date de naissance doit être dans le passé'
      }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'phone_number',
    validate: {
      notEmpty: { msg: 'Le numéro de téléphone est obligatoire' },
      is: {
        args: /^\+?[0-9]{10,15}$/,
        msg: 'Le numéro de téléphone n\'est pas valide'
      }
    }
  },
  address: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'L\'adresse est obligatoire' },
      len: {
        args: [1, 200],
        msg: 'L\'adresse ne doit pas dépasser 200 caractères'
      }
    }
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'La ville ne doit pas dépasser 50 caractères'
      }
    }
  },
  postalCode: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'postal_code',
    validate: {
      len: {
        args: [0, 10],
        msg: 'Le code postal ne doit pas dépasser 10 caractères'
      }
    }
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'Le pays ne doit pas dépasser 50 caractères'
      }
    }
  }
}, {
  tableName: 'students',
  timestamps: true,
  underscored: true
});

module.exports = Student;
