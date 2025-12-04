// Service to check if a password has been exposed in data breaches
// Uses the k-anonymity model from Have I Been Pwned API

export const checkBreach = async (password: string): Promise<number> => {
  if (!password) return 0;

  try {
    // 1. Hash the password using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // 2. Send only the first 5 characters (k-anonymity)
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const text = await response.text();
    
    // 3. Check if the suffix exists in the response
    const lines = text.split('\n');
    const match = lines.find(line => line.startsWith(suffix));

    if (match) {
      // Return the count of times it was seen
      const count = parseInt(match.split(':')[1]);
      return count;
    }

    return 0;
  } catch (error) {
    console.warn("Breach check failed (likely offline):", error);
    return 0; // Fail open (assume safe if offline)
  }
};