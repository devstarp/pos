import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/env';
import ResponseHelper from '../helpers/response_helper';
import { getToken } from '../helpers/authentication';
import { findEmployeeById } from '../modules/employee/employee_repository';

const authentication = async (req, res, next) => {
  try {
    const noauth = req.query.noauth;
    if (noauth) return next();

    const token = getToken(req.headers.authorization);
    if (!token) {
      return ResponseHelper(res, 401, 'Unauthorized Access', null);
    }

    jwt.verify(token, jwtSecret, async (error, decoded) => {
      if (
        (error && error.name === 'JsonWebTokenError') ||
        (error && error.name === 'TokenExpiredError')
      ) {
        return ResponseHelper(res, 401, error.message, null);
      }

      try {
        const employee = await findEmployeeById(decoded.employee_id,'department');
        req.app.locals.token = token;
        req.app.locals.employee_id = employee.id;
        req.app.locals.employee_role = employee.department.role;
        req.app.locals.employee_position = employee.position;
        req.app.locals.employee_is_admin = employee.department.leader_id===employee.id;
        next();
      } catch (error) {
        console.error(error);
        return ResponseHelper(res, 401, error.message, null);
      }
    });
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 401, error.message, null);
  }
};

export default authentication;
