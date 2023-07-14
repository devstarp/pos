
export const rules = {
  email: [
    {
      type: 'email',
      message: 'Please enter a validate email!'
    }
  ],
  username: [
    {
      required: true,
      message: 'Please input your username'
    },
  ],
  display_name: [
    {
      required: true,
      message: 'Please input your real name'
    }
  ],
  password: [
    {
      required: true,
      message: 'Please input your password'
    }
  ],
  confirm_password: [
    {
      required: true,
      message: 'Please confirm your password!'
    },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve()
        }
        return Promise.reject('Passwords do not match!')
      }
    })
  ]
}
export const emailRule={type: 'email',message: 'Please enter a validate email!'}
export const confirmRule=(name)=>({ getFieldValue }) => ({
  validator(rule, value) {
    if (!value || getFieldValue(name) === value) {
      return Promise.resolve()
    }
    return Promise.reject('not match!')
  }
})
export const requiredRule = {required: true, message: 'Required'}
export const numberRule = {type: 'number', message: 'Only Number'}