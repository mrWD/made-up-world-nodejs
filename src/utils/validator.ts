export const validateLoginPassword = (login: string, password: string): string | undefined => {
  if (!login) return 'Login is required!';

  if (login.length < 3 || login.length > 16) return 'Min Login length is 3 and max is 16 symbols!';
  
  if (!/^[a-zA-Z0-9]/.test(login)) return 'Login can have only Latin symbols and numbers!';

  if (!password) return 'Password is required!';
  
  if (password.length < 3) return 'Min password length is 3 symbols!';
};

export const validatePassConfirm = (pass: string, passConfirm: string): string | undefined => {
  if (!passConfirm) return 'Password Confirmation is required!';

  if (pass !== passConfirm) return 'Password Confirmation has to be equal to the Passowrd!';
}

export default {
  validateLoginPassword,
  validatePassConfirm,
};
