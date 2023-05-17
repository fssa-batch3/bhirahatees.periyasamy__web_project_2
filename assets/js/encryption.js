const encryption = (s, k) => {
  let result = "";
  for (let i = 0; i < s.length; i++) {
    result += String.fromCharCode(s[i].charCodeAt() + k);
  }
  return result;
};
