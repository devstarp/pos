import { validationResult } from 'express-validator';
import { generatePassword, generateToken, comparePassword } from '../../helpers/authentication';
import { findOneEmployee, createEmployee, findEmployeeById, updateEmployee} from '../employee/employee_repository';
import ResponseHelper from '../../helpers/response_helper';
import bcrypt from 'bcryptjs';

// Register new user
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'validation error', errors.array());
  }

  try {
    const {email,id,username,password,confirm_password,...data} = req.body;
    const employee = await updateEmployee({username,email,password,...data},{id});
    return ResponseHelper(res, 200, `success register new user`, employee);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed register new user', error.message);
  }
};

// Login user
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'validation error', errors.array());
  }

  try {
    const { username, password } = req.body;

    const employee = await findOneEmployee({ username, email:username, id:username, operation:'OR' }, '');
    // Check Email
    if (!employee) {
      return ResponseHelper(res, 409, 'not registered', [
        { errors: ['not registered'], name: 'username' },
      ]);
    }

    const isMatch = await comparePassword(password, employee.password);

    // Check Password
    if (!isMatch) {
      return ResponseHelper(res, 409, 'wrong password', [
        { errors: ['wrong password'], name: 'password' },
      ]);
    }

    const token = generateToken(employee.id);
    employee.last_login = Date.now();
    await employee.save();
    delete employee.password;

    return ResponseHelper(res, 200, 'success login', { token, employee });
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed login', error.message);
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    return ResponseHelper(res, 200, 'success logout', { employee_id });
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed login', error.message);
  }
};

export { register, login, logout };
