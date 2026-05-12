// Admin login credentials config

export const ADMIN_CREDENTIALS = {
  username: ((import.meta as any).env?.VITE_ADMIN_USER as string) || 'admin',
  password: ((import.meta as any).env?.VITE_ADMIN_PASS as string) || 'password123'
};

export const checkCredentials = (user: string, pass: string): boolean => {
  return (
    user.trim().toLowerCase() === ADMIN_CREDENTIALS.username.trim().toLowerCase() &&
    pass === ADMIN_CREDENTIALS.password
  );
};
