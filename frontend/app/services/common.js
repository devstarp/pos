/* eslint-disable func-names */
import * as axios from 'axios';
import { fetch } from './fetch';
// import {
//   restApiSettings,
//   notifyExceptionUrlPrefixs,
//   networkStatusExceptionUrlPrefixs
// } from '../config/api';
import { getGeneralErrorMessages, get400ErrorMessages } from './errorUtils';
// import { staticStore } from '../redux/configureStore';
import { getLocalToken, removeLocalToken } from './localStorage';

const getUrl = function (path, params = {}) {
  const url = new URL(`${restApiSettings.baseURL}${path}`);

  for (const [key, value] of Object.entries(params)) {
    // if (value) url.searchParams.append(String(key), String(value));
    url.searchParams.append(String(key), String(value));
  }
  return url.toString();
};

// const checkAndGetNotifyMessage = (method, url) => {
//   let message = null;
//   const type = 'success';

//   if (!method || method === undefined || !url || url === undefined) { return { type: null, message: null }; }

//   for (let i = 0; i < notifyExceptionUrlPrefixs.length; i++) {
//     if (url.includes(notifyExceptionUrlPrefixs[i])) return { type: null, message: null };
//   }
//   if (method === 'POST') {
//     message = 'Ajouté avec succès.';
//   } else if (method === 'PUT') {
//     message = 'Enregistré avec succès.';
//   } else if (method === 'DELETE') {
//     message = 'Supprimé avec succès.';
//   }

//   return { type, message };
// };

// export const preCheckUrl = (method, url) => {
//   let type = null;
//   let message = null;

//   // Check gnerate_pdf API
//   if (method == 'POST' && url.includes('/generate_pdf/')) {
//     type = 'info';
//     message = "Rendu d'un fichier pdf pour AF Checker. Cela prendra plusieurs minutes. Attendez un peu, s'il vous plaît.";
//     staticStore && staticStore.dispatch(setNotify({ open: true, type, message }));
//     return;
//   }

//   if (method == 'POST' && url.includes('/prescription/create/')) {
//     type = 'info';
//     message = "Rendu d'un fichier pdf pour la prescription. Cela prendra plusieurs minutes. Attendez un peu, s'il vous plaît.";
//     staticStore && staticStore.dispatch(setNotify({ open: true, type, message }));
//     return;
//   }
//   // if (method == 'POST' && url.includes('/invoice_generate_pdf/')) {
//   //   type = 'info';
//   //   message = 'Rendering a pdf file for the invoice. It\'ll take serveral minutes. Please wait a little.';
//   //   staticStore && staticStore.dispatch(setNotify({ open: true, type: type, message }));
//   //   return
//   // }
//   const expression = /af_setup\/([0-9]*)\/approve/g;
//   const regex = new RegExp(expression);

//   if (method == 'POST' && url.match(regex)) {
//     type = 'info';
//     message = "Rendu d'un fichier pdf pour facture. Cela prendra plusieurs minutes. Attendez un peu, s'il vous plaît.";
//     staticStore && staticStore.dispatch(setNotify({ open: true, type, message }));
//   }
// };

// export const checkAndUpdateNetworkStatus = (method, url, loading = false) => {
//   for (let i = 0; i < networkStatusExceptionUrlPrefixs.length; i++) {
//     if (url.includes(networkStatusExceptionUrlPrefixs[i])) return;
//   }
//   console.log('url===', url, loading);
//   staticStore && staticStore.dispatch(loading ? addNetwork(url) : removeNetwork(url));
// };

export const query = async function (path, options = {}, useToken = true, skipNotify = true, skipNetworkStatus = false) {
  let res = null;
  const isDevEnv = (process.env.NODE_ENV === 'development');

  if (!options.headers) {
    options.headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0',
      Accept: 'application/json',
    };
  }
  options.headers = options.headers || {};
  const userInfo = useToken ? getLocalToken() : null;
  const token = (userInfo && userInfo.token);

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  const url = getUrl(path, options.searchParams || {});
  try {
    // if (!skipNetworkStatus) {
    //   checkAndUpdateNetworkStatus(options.method, url, true);
    // }
    // preCheckUrl(options.method, url);
    const response = await fetch(url, options);

    // if (!skipNetworkStatus) {
    //   checkAndUpdateNetworkStatus(options.method, url, false);
    // }

    if (response.status >= 200 && response.status < 300) {
      if (options && (options.responseType === 'blob')) {
        res = response;
      } else {
        res = response.data;
      }

      // Notify result.
      // if (!skipNotify) {
      //   const { type, message } = checkAndGetNotifyMessage(options.method, url);

      //   if (message) {
      //     staticStore && staticStore.dispatch(setNotify({ open: true, type, message }));
      //   }
      // }

      return res;
    }
    console.log('===== return null');
    return null;
  } catch (error) {
    // if (!skipNetworkStatus) {
    //   checkAndUpdateNetworkStatus(options.method, url, false);
    // }
    console.log('===== error: ', error, error.response);
    const errorResponse = error.response;

    let message = 'Erreur - Merci de contacter notre service technique';
    let status = 408;
    let errorMessage = null;

    if (errorResponse === undefined || !errorResponse) {
      message = error.message;
      if (isDevEnv) { errorMessage = 'Network error'; }
    } else if (errorResponse.status >= 500) {
      status = errorResponse.status;
      errorMessage = errorResponse.data.error || 'Failed by server error.';
      if (isDevEnv) { message = 'Failed by server error.'; }
    } else if (errorResponse.status === 400) {
      status = errorResponse.status;
      errorMessage = errorResponse.data.error;
      if (isDevEnv) { message = get400ErrorMessages(errorResponse.data.error); }
    } else if (errorResponse.status === 401) {
      status = errorResponse.status;
      errorMessage = errorResponse.statusText;
      message = "L'authentification a échoué. Veuillez vous reconnecter avec vos informations d'identification.";
      staticStore && staticStore.dispatch(setAuthClear());
      removeLocalToken();
      // history.push('/login');
    } else {
      status = errorResponse.status;
      errorMessage = errorResponse.data.error === undefined ? 'Unknow Error' : errorResponse.data.error;
      if (isDevEnv) { message = getGeneralErrorMessages(errorMessage); }
    }
    // staticStore && staticStore.dispatch(setNotify({ open: true, type: 'error', message }));
    return { status, error: errorMessage };
  }
};

export const jsonQuery = async  (path, method, data, useToken = true, skipNotify = true)=> await query(
    path,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data,
    },
    useToken,
    skipNotify
  );

