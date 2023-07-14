
const getString = (value) => (value || '').toString();
const getObject = (value) => {
	return typeof value === 'object' ? value : {};
};

const getDateIfValid = (value) => {
	const date = Date.parse(value);
	return isNaN(date) ? null : new Date(date);
};

const getArrayIfValid = (value) => {
	return Array.isArray(value) ? value : null;
};

const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

const getNumberIfValid = (value) => (isNumber(value) ? parseFloat(value) : null);

const getNumberIfPositive = (value) => {
	const n = getNumberIfValid(value);
	return n && n >= 0 ? n : undefined;
};

const getNumberIdIfValid = (value)=>{
	const n = getNumberIfValid(value)
	return n && n > 0 ? n : undefined;
}

const getBoolNumberIfValid = (value, defaultValue = 0) => {
	if (value === 'true' || value === 'false') {
		return value === 'true' ? 1 : 0;
	} else if (typeof value === 'boolean') {
		return value ? 1 : 0;
	} else if (typeof value === 'number') {
		return value > 1 ? defaultValue : value;
	} else {
		return null;
	}
};
const getBooleanIfValid = (value, defaultValue = null) => {
	if (value === 'true' || value === 'false') {
		return value === 'true';
	} else {
		return typeof value === 'boolean' ? value : defaultValue;
	}
};

const getBrowser = (browser) => {
	return browser
		? {
				ip: getString(browser.ip),
				user_agent: getString(browser.user_agent),
		  }
		: {
				ip: '',
				user_agent: '',
		  };
};

const getAddress = (address) => {
	let coordinates = {
		latitude: '',
		longitude: '',
	};

	if (address && address.coordinates) {
		coordinates.latitude = address.coordinates.latitude;
		coordinates.longitude = address.coordinates.longitude;
	}
	return address
		? {
				id: new ObjectID(),
				first_name: getString(address.first_name),
				last_name: getString(address.last_name),
				address1: getString(address.address1),
				address2: getString(address.address2),
				city: getString(address.city),
				country: getObject(address.country),
				postal_code: getString(address.postal_code),
				state: getObject(address.state),
				phone: getString(address.phone),
				company: getString(address.company),
				tax_number: getString(address.tax_number),
				coordinates: coordinates,
				details: address.details,
				default_billing: getBooleanIfValid(address.default_billing),
				default_shipping: getBooleanIfValid(address.default_shipping),
		  }
		: {};
};

const getInitialName=(name)=>{
	const names = getString(name).split(' ');
  	let initials = names[0].substring(0, 1).toUpperCase();
	if (names.length > 1) {
		initials += names[names.length - 1].substring(0, 1).toUpperCase();
	}else{
		initials = names[0].substring(0, 2).toUpperCase();
	}
	return initials
}

const generateCode=(name)=>{
	const initials = getInitialName(name);
	const currentDate = Date.now();
	// const dateCode = `${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;
	return initials+currentDate
}

const getOrderFieldname=(fieldName)=>{
	let name = getString(fieldName);
	if(name.length<6){
		return undefined
	}
	console.log('name.substr(name.length-6)---', name.substr(name.length-6))
	if(name.substr(name.length-5)==='order'){
		return name.substr(0, name.length-6)
	}else{
		return undefined
	}
}

export default {
	getString,
	getObject,
	getBoolNumberIfValid,
	getDateIfValid,
	getArrayIfValid,
	getNumberIdIfValid,
	getNumberIfValid,
	getNumberIfPositive,
	getBooleanIfValid,
	getBrowser,
	getAddress,
	generateCode,
	getOrderFieldname
};
