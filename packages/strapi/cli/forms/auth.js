'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const chalk = require('chalk');
const {validate} = require('email-validator');

// Utils.
const textInput = require('../utils/input/text');

function rightPad(string, n = 12) {
  n -= string.length;
  return string + ' '.repeat(n > -1 ? n : 0);
}

module.exports = async (email) => {
  const state = {
    error: undefined,
    credentialsGroupLabel: `\n> ${chalk.bold('Enter credentials')}`,

    email: {
      label: rightPad('Email'),
      placeholder: 'john.doe@acme.com',
      validateValue: data => validate(data)
    },

    password: {
      label: rightPad('Password'),
      placeholder: '',
      validateValue: data => data.trim().length > 0
    }
  };

  if (email) {
    state.email.initialValue = email;
  }

  async function render() {
    for (const key in state) {
      if (!Object.hasOwnProperty.call(state, key)) {
        continue;
      }

      const piece = state[key];
      if (typeof piece === 'string') {
        console.log(piece);
      } else if (typeof piece === 'object') {
        let result;

        try {
          result = await textInput({
            label: '- ' + piece.label,
            initialValue: piece.initialValue || piece.value,
            placeholder: piece.placeholder,
            mask: piece.mask,
            validateKeypress: piece.validateKeypress,
            validateValue: piece.validateValue,
            autoComplete: piece.autoComplete
          });

          piece.value = result;

          if (key === 'password') {
            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${'*'.repeat(result.length)}\n`);
          } else {
            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${result}\n`);
          }
        } catch (err) {
          if (err.message === 'USER_ABORT') {
            process.exit(1);
          } else {
            console.error(err);
          }
        }
      }
    }

    return {
      email: state.email.value,
      password: state.password.value
    };
  }

  return render().catch(console.error);
};
