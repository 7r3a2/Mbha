import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// File paths
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const CODES_FILE = path.join(process.cwd(), 'data', 'unique-codes.json');

// Ensure data files exist
const ensureFilesExist = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
  }
  if (!fs.existsSync(CODES_FILE)) {
    fs.writeFileSync(CODES_FILE, '[]');
  }
};

// Load users from file
export const loadUsers = () => {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

// Save users to file
export const saveUsers = (users: any[]) => {
  ensureFilesExist();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// Load unique codes from file
export const loadUniqueCodes = () => {
  ensureFilesExist();
  try {
    const data = fs.readFileSync(CODES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading unique codes:', error);
    return [];
  }
};

// Save unique codes to file
export const saveUniqueCodes = (codes: any[]) => {
  ensureFilesExist();
  try {
    fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error('Error saving unique codes:', error);
    throw error;
  }
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  try {
    // For backward compatibility, try JWT first
    const jwtPayload = jwt.verify(token, JWT_SECRET);
    
    // If JWT verification succeeds, check if it has sessionId
    if (jwtPayload && typeof jwtPayload === 'object' && 'sessionId' in jwtPayload) {
      // This is a new session-based token, return the payload
      return jwtPayload;
    }
    
    // This is an old JWT token without sessionId, return null to force re-login
    return null;
  } catch (error) {
    return null;
  }
};

// Validate unique code
export const validateUniqueCode = (code: string): { valid: boolean; codeData?: any } => {
  const codes = loadUniqueCodes();
  const codeData = codes.find((c: any) => c.code === code && !c.used);
  
  if (codeData) {
    return { valid: true, codeData };
  }
  
  return { valid: false };
};

// Mark unique code as used
export const markCodeAsUsed = (code: string, userId: string) => {
  const codes = loadUniqueCodes();
  const codeIndex = codes.findIndex((c: any) => c.code === code);
  
  if (codeIndex !== -1) {
    codes[codeIndex].used = true;
    codes[codeIndex].usedBy = userId;
    codes[codeIndex].usedAt = new Date().toISOString();
    saveUniqueCodes(codes);
  }
};

// Generate new unique codes
export const generateNewCodes = (count: number = 5) => {
  const codes = loadUniqueCodes();
  const newCodes = [];
  
  for (let i = 0; i < count; i++) {
    const codeNumber = codes.length + i + 1;
    const newCode = {
      code: `MBHA2024-${codeNumber.toString().padStart(3, '0')}`,
      used: false,
      createdAt: new Date().toISOString(),
      usedBy: null,
      usedAt: null
    };
    newCodes.push(newCode);
  }
  
  const updatedCodes = [...codes, ...newCodes];
  saveUniqueCodes(updatedCodes);
  return newCodes;
}; 