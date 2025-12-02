const cache = new Map();

const sha1 = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
};

export const isPasswordBreached = async (password) => {
  if (!password || password.length < 8) return false;
  try {
    const hash = await sha1(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const cached = cache.get(prefix);
    let responseText = cached;

    if (!responseText) {
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) return false;
      responseText = await response.text();
      cache.set(prefix, responseText);
    }

    return responseText.split('\n').some((line) => {
      const [hashSuffix,] = line.trim().split(':');
      return hashSuffix === suffix;
    });
  } catch (error) {
    console.warn('Failed to check password breach status:', error);
    return false;
  }
};

const pwnedCache = {}; // Cache responses to avoid repeated API calls for same prefix

export const checkPasswordPwned = async (password) => {
  if (!password) return 0;

  const hash = await sha1(password);
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  const getCountFromCache = () => {
    if (!pwnedCache[prefix]) return 0;
    return pwnedCache[prefix][suffix] || 0;
  };

  if (pwnedCache[prefix]) {
    return getCountFromCache();
  }

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      // If API fails, assume not pwned to avoid blocking user, but log warning
      console.warn(`Pwned Passwords API returned ${response.status}`);
      return 0;
    }
    const text = await response.text();
    const suffixCounts = text.split('\r\n').reduce((acc, line) => {
      if (!line) return acc;
      const [lineSuffix, countString] = line.split(':');
      if (!lineSuffix) return acc;
      const parsedCount = parseInt(countString, 10) || 0;
      acc[lineSuffix] = parsedCount;
      return acc;
    }, {});

    pwnedCache[prefix] = suffixCounts; // Cache the mapping for this prefix
    return suffixCounts[suffix] || 0;
  } catch (error) {
    console.error('Error checking password with Have I Been Pwned API:', error);
    return 0; // Assume not pwned on network error
  }
};
