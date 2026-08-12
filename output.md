# JavaScript — 350 Interview Questions: Answers, Code & Usage
> Answered from the uploaded 350-question practice set. Each item includes a concise explanation, a code example, and a usage/result example. The original source is question-only; explanations and implementations below are added to answer the questions. fileciteturn0file0L1-L8
## How to use this guide

Run examples in a modern browser console or Node.js. Browser-only examples are marked where relevant. For interview preparation, first explain the concept, then write the implementation, then state time/space complexity when applicable.

---

## Strings

### 1. How would you count the number of vowels in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function countVowels(s) { return [...s.toLowerCase()].filter(c => "aeiou".includes(c)).length; }
console.log(countVowels("Interview")); // 4
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 2. How would you reverse a string without using `reverse()`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function reverseString(s) { let out = ""; for (let i = s.length - 1; i >= 0; i--) out += s[i]; return out; }
console.log(reverseString("hello")); // "olleh"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 3. How would you check whether a string is a palindrome?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const isPalindrome = s => s === [...s].reverse().join("");
console.log(isPalindrome("level")); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 4. How would you find the longest word in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function longestWord(s) { return s.trim().split(/\s+/).reduce((a, w) => w.length > a.length ? w : a, ""); }
console.log(longestWord("I love JavaScript")); // "JavaScript"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 5. How would you capitalize the first letter of every word?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const capitalizeWords = s => s.replace(/\b\w/g, c => c.toUpperCase());
console.log(capitalizeWords("hello world")); // "Hello World"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 6. How would you count the frequency of every character in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function charFrequency(s) { const m = {}; for (const c of s) m[c] = (m[c] || 0) + 1; return m; }
console.log(charFrequency("hello")); // {h:1,e:1,l:2,o:1}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 7. How would you find the most frequently occurring character in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function mostFrequentChar(s) { const m = {}; for (const c of s) m[c] = (m[c]||0)+1; return [...s].reduce((best,c)=>m[c] > m[best] ? c : best, s[0]); }
console.log(mostFrequentChar("banana")); // "a"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 8. How would you find all duplicate characters in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const duplicateChars = s => [...new Set([...s].filter((c,i,a) => a.indexOf(c) !== i))];
console.log(duplicateChars("programming"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 9. How would you return only characters that occur exactly once?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function uniqueChars(s) { const m = charFrequency(s); return [...s].filter(c => m[c] === 1).join(""); }
console.log(uniqueChars("swiss")); // "wi"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 10. How would you remove duplicate characters while preserving their original order?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const removeDuplicates = s => [...new Set(s)].join("");
console.log(removeDuplicates("banana")); // "ban"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 11. How would you check whether two strings are anagrams?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const isAnagram = (a,b) => [...a].sort().join("") === [...b].sort().join("");
console.log(isAnagram("listen","silent")); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 12. How would you find the first non-repeating character in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function firstNonRepeating(s) { const m = charFrequency(s); return [...s].find(c => m[c] === 1) ?? null; }
console.log(firstNonRepeating("swiss")); // "w"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 13. How would you find the first repeating character in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function firstRepeating(s) { const seen = new Set(); for (const c of s) { if (seen.has(c)) return c; seen.add(c); } return null; }
console.log(firstRepeating("swiss")); // "s"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 14. How would you find the longest substring without repeating characters?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function longestUnique(s) { let l=0,best=""; const set=new Set(); for(let r=0;r<s.length;r++){ while(set.has(s[r])) set.delete(s[l++]); set.add(s[r]); if(r-l+1>best.length) best=s.slice(l,r+1); } return best; }
console.log(longestUnique("abcabcbb")); // "abc"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 15. How would you find the longest palindromic substring?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function longestPalindrome(s) { let best=""; const expand=(l,r)=>{while(l>=0&&r<s.length&&s[l]===s[r]){if(r-l+1>best.length)best=s.slice(l,r+1);l--;r++;}}; for(let i=0;i<s.length;i++){expand(i,i);expand(i,i+1)} return best; }
console.log(longestPalindrome("babad")); // "bab" or "aba"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 16. How would you count occurrences of a substring without using `match()` or regular expressions?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function countSubstring(s, sub) { let count=0, i=0; while((i=s.indexOf(sub,i))!==-1){count++; i++;} return count; }
console.log(countSubstring("aaaa","aa")); // 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 17. How would you implement `replaceAll()` without using the built-in method?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const replaceAllCustom = (s,a,b) => s.split(a).join(b);
console.log(replaceAllCustom("a-b-a","-","/")); // "a/b/a"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 18. How would you compress a string using run-length encoding?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function compress(s) { let out=""; for(let i=0;i<s.length;i++){let j=i;while(s[j]===s[i])j++;out+=s[i]+(j-i);i=j-1;} return out; }
console.log(compress("aaabbc")); // "a3b2c1"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 19. How would you decompress a run-length encoded string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function decompress(s) { return s.replace(/(.)(\d+)/g, (_,c,n)=>c.repeat(Number(n))); }
console.log(decompress("a3b2c1")); // "aaabbc"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 20. How would you find the longest common prefix among an array of strings?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function commonPrefix(a) { if(!a.length)return ""; let p=a[0]; for(const s of a.slice(1)) while(!s.startsWith(p)) p=p.slice(0,-1); return p; }
console.log(commonPrefix(["flower","flow","flight"])); // "fl"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 21. How would you check whether a string is a pangram?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const isPangram = s => new Set(s.toLowerCase().match(/[a-z]/g)).size === 26;
console.log(isPangram("The quick brown fox jumps over the lazy dog")); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 22. How would you convert a string to camelCase?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const camelCase = s => s.toLowerCase().replace(/[-_\s]+(.)?/g, (_,c)=>c?c.toUpperCase():"");
console.log(camelCase("hello world")); // "helloWorld"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 23. How would you convert a string to kebab-case?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const kebabCase = s => s.trim().toLowerCase().replace(/\s+/g,"-");
console.log(kebabCase("Hello World")); // "hello-world"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 24. How would you convert a string to snake_case?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const snakeCase = s => s.trim().toLowerCase().replace(/\s+/g,"_");
console.log(snakeCase("Hello World")); // "hello_world"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 25. How would you convert a string to title case?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const titleCase = s => s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
console.log(titleCase("hello javascript")); // "Hello Javascript"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 26. How would you toggle the case of every character?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const toggleCase = s => [...s].map(c=>c===c.toUpperCase()?c.toLowerCase():c.toUpperCase()).join("");
console.log(toggleCase("Hello")); // "hELLO"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 27. How would you remove all whitespace from a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const removeWhitespace = s => s.replace(/\s/g,"");
console.log(removeWhitespace("a b\n c")); // "abc"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 28. How would you count the number of words in a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const wordCount = s => s.trim() ? s.trim().split(/\s+/).length : 0;
console.log(wordCount("one two three")); // 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 29. How would you mask an email address while preserving the original username length?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function maskEmail(email){const [u,d]=email.split("@"); return u[0]+"*".repeat(Math.max(0,u.length-1))+"@"+d;}
console.log(maskEmail("john@example.com")); // "j***@example.com"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 30. How would you truncate a string to a maximum length while handling whitespace correctly?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function truncate(s,n){s=s.trim(); return s.length<=n?s:s.slice(0,n).trimEnd()+"…";}
console.log(truncate("hello world",8)); // "hello wo…"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Numbers & Mathematics

### 31. How would you calculate the factorial of a number recursively and iteratively?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const factorial = n => n <= 1 ? 1 : n * factorial(n-1);
console.log(factorial(5)); // 120
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 32. How would you generate the Fibonacci sequence?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function fibonacci(n){let a=0,b=1,out=[];for(let i=0;i<n;i++){out.push(a);[a,b]=[b,a+b]}return out;}
console.log(fibonacci(6)); // [0,1,1,2,3,5]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 33. How would you find the nth Fibonacci number efficiently?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function fib(n){let a=0,b=1;while(n--) [a,b]=[b,a+b];return a;}
console.log(fib(10)); // 55
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 34. How would you check whether a number is prime?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function isPrime(n){if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;}
console.log(isPrime(17)); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 35. How would you find the sum of digits of a number?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const digitSum = n => [...String(Math.abs(n))].reduce((a,d)=>a+Number(d),0);
console.log(digitSum(1234)); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 36. How would you calculate the digital root of a number?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function digitalRoot(n){n=Math.abs(n);while(n>=10)n=[...String(n)].reduce((a,d)=>a+ +d,0);return n;}
console.log(digitalRoot(9875)); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 37. How would you check whether a number is a palindrome?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const numberPalindrome = n => String(n) === [...String(n)].reverse().join("");
console.log(numberPalindrome(121)); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 38. How would you check whether a number is an Armstrong number?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function armstrong(n){const ds=[...String(n)];return ds.reduce((s,d)=>s+d**ds.length,0)===n;}
console.log(armstrong(153)); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 39. How would you calculate GCD and LCM of two numbers?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a); const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
console.log(gcd(12,18), lcm(12,18)); // 6 36
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 40. How would you check whether a number is a power of two?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const powerOfTwo = n => n>0 && (n & (n-1)) === 0;
console.log(powerOfTwo(16)); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 41. How would you check whether a number is a perfect square?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const perfectSquare = n => Number.isInteger(Math.sqrt(n));
console.log(perfectSquare(49)); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 42. How would you calculate the square root without using `Math.sqrt()`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function sqrt(n){let x=n||1; for(let i=0;i<20;i++) x=(x+n/x)/2; return x;}
console.log(sqrt(25)); // ~5
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 43. How would you implement exponentiation efficiently for large exponents?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function pow(a,n){if(n<0)return 1/pow(a,-n);let r=1;while(n){if(n%2)r*=a;a*=a;n=Math.floor(n/2)}return r;}
console.log(pow(2,10)); // 1024
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 44. How would you determine whether a year is a leap year?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const leapYear = y => y%400===0 || (y%4===0 && y%100!==0);
console.log(leapYear(2024)); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 45. How would you reverse the digits of an integer without converting it to a string?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function reverseDigits(n){let sign=Math.sign(n);n=Math.abs(n);let r=0;while(n){r=r*10+n%10;n=Math.floor(n/10)}return sign*r;}
console.log(reverseDigits(-120)); // -21
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Arrays & Hashing

### 46. How would you find the sum and average of all elements in an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function sumAverage(a){const sum=a.reduce((s,x)=>s+x,0);return {sum,average:sum/a.length};}
console.log(sumAverage([1,2,3])); // {sum:6, average:2}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 47. How would you find the maximum and minimum values without using `Math.max()` or `Math.min()`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function minMax(a){let min=a[0],max=a[0];for(const x of a){if(x<min)min=x;if(x>max)max=x}return [min,max];}
console.log(minMax([3,1,5])); // [1,5]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 48. How would you find the second-largest element in an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function secondLargest(a){let first=-Infinity,second=-Infinity;for(const x of a){if(x>first){second=first;first=x}else if(x>second&&x!==first)second=x}return second;}
console.log(secondLargest([5,1,4,5,3])); // 4
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 49. How would you remove duplicate elements from an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const uniqueArray = a => [...new Set(a)];
console.log(uniqueArray([1,2,2,3])); // [1,2,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 50. How would you move all zeroes to the end of an array in-place?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function moveZeroes(a){let w=0;for(const x of a)if(x!==0)a[w++]=x;while(w<a.length)a[w++]=0;return a;}
console.log(moveZeroes([0,1,0,3,12])); // [1,3,12,0,0]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 51. How would you rotate an array by `k` positions?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function rotate(a,k){k%=a.length;return a.slice(-k).concat(a.slice(0,-k));}
console.log(rotate([1,2,3,4,5],2)); // [4,5,1,2,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 52. How would you reverse an array in-place?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function reverseInPlace(a){for(let l=0,r=a.length-1;l<r;l++,r--)[a[l],a[r]]=[a[r],a[l]];return a;}
console.log(reverseInPlace([1,2,3])); // [3,2,1]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 53. How would you determine whether an array is sorted?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const isSorted=a=>a.every((x,i)=>i===0||a[i-1]<=x);
console.log(isSorted([1,2,3])); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 54. How would you find the missing number from an array containing numbers from `1` to `n`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function missing(a,n){const expected=n*(n+1)/2;return expected-a.reduce((s,x)=>s+x,0);}
console.log(missing([1,2,4,5],5)); // 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 55. How would you find the duplicate number when an array contains numbers from `1` to `n`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function duplicate(a){const seen=new Set();for(const x of a){if(seen.has(x))return x;seen.add(x)}}
console.log(duplicate([1,3,4,2,2])); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 56. How would you find the intersection of two arrays?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const intersection=(a,b)=>[...new Set(a)].filter(x=>b.includes(x));
console.log(intersection([1,2,2,3],[2,3,4])); // [2,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 57. How would you find the union of two arrays?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const union=(a,b)=>[...new Set([...a,...b])];
console.log(union([1,2],[2,3])); // [1,2,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 58. How would you find the difference between two arrays?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const difference=(a,b)=>a.filter(x=>!b.includes(x));
console.log(difference([1,2,3],[2])); // [1,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 59. How would you find the symmetric difference between two arrays?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const symmetricDifference=(a,b)=>[...new Set([...a.filter(x=>!b.includes(x)),...b.filter(x=>!a.includes(x))])];
console.log(symmetricDifference([1,2],[2,3])); // [1,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 60. How would you find the most frequent element in an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function mostFrequent(a){const m=new Map();a.forEach(x=>m.set(x,(m.get(x)||0)+1));return [...m].reduce((p,c)=>c[1]>p[1]?c:p)[0];}
console.log(mostFrequent([1,2,2,3])); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 61. How would you group array elements based on a property?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const groupBy=(a,key)=>a.reduce((g,x)=>((g[x[key]]??=[]).push(x),g),{});
console.log(groupBy([{type:"a",id:1},{type:"b",id:2},{type:"a",id:3}],"type"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 62. How would you partition an array into two groups based on a condition?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const partition=(a,p)=>[a.filter(p),a.filter(x=>!p(x))];
console.log(partition([1,2,3,4],x=>x%2===0)); // [[2,4],[1,3]]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 63. How would you merge two sorted arrays in `O(n + m)` time?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function merge(a,b){let i=0,j=0,r=[];while(i<a.length||j<b.length)r.push(j===b.length||(i<a.length&&a[i]<=b[j])?a[i++]:b[j++]);return r;}
console.log(merge([1,3],[2,4])); // [1,2,3,4]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 64. How would you find the kth-largest element in an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const kthLargest=(a,k)=>[...a].sort((x,y)=>y-x)[k-1];
console.log(kthLargest([3,1,5,2],2)); // 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 65. How would you find all pairs whose sum equals a target?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function pairSum(a,t){const out=[];for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]+a[j]===t)out.push([a[i],a[j]]);return out;}
console.log(pairSum([1,2,3,4],5)); // [[1,4],[2,3]]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 66. How would you find all triplets whose sum equals zero?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function threeSum(a){a.sort((x,y)=>x-y);const r=[];for(let i=0;i<a.length-2;i++){let l=i+1,h=a.length-1;while(l<h){const s=a[i]+a[l]+a[h];if(s===0){r.push([a[i],a[l],a[h]]);l++;h--}else s<0?l++:h--}}return r;}
console.log(threeSum([-1,0,1,2,-1,-4]));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 67. How would you solve the Two Sum problem in `O(n)` time?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function twoSum(a,t){const m=new Map();for(let i=0;i<a.length;i++){const j=m.get(t-a[i]);if(j!==undefined)return [j,i];m.set(a[i],i)}}
console.log(twoSum([2,7,11,15],9)); // [0,1]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 68. How would you find the maximum subarray sum using Kadane's algorithm?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function maxSubarray(a){let best=a[0],cur=a[0];for(let i=1;i<a.length;i++){cur=Math.max(a[i],cur+a[i]);best=Math.max(best,cur)}return best;}
console.log(maxSubarray([-2,1,-3,4,-1,2,1,-5,4])); // 6
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 69. How would you find the product of every element except itself without using division?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function productExceptSelf(a){const r=Array(a.length).fill(1);let p=1;for(let i=0;i<a.length;i++){r[i]=p;p*=a[i]}p=1;for(let i=a.length-1;i>=0;i--){r[i]*=p;p*=a[i]}return r;}
console.log(productExceptSelf([1,2,3,4])); // [24,12,8,6]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 70. How would you find the majority element appearing more than `n / 2` times?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function majority(a){let c=0,cand;for(const x of a){if(c===0)cand=x;c+=x===cand?1:-1}return cand;}
console.log(majority([2,2,1,1,1,2,2])); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Sliding Window, Two Pointers & Algorithms

### 71. How would you find the maximum sum of a subarray of size `k`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function maxWindowSum(a,k){let s=a.slice(0,k).reduce((x,y)=>x+y,0),best=s;for(let i=k;i<a.length;i++){s+=a[i]-a[i-k];best=Math.max(best,s)}return best;}
console.log(maxWindowSum([2,1,5,1,3,2],3)); // 9
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 72. How would you find the smallest subarray whose sum is greater than or equal to a target?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function minSubarray(a,t){let l=0,s=0,b=Infinity;for(let r=0;r<a.length;r++){s+=a[r];while(s>=t){b=Math.min(b,r-l+1);s-=a[l++]} }return b===Infinity?0:b;}
console.log(minSubarray([2,1,5,2,3,2],7)); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 73. How would you find the longest substring containing at most `k` distinct characters?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function atMostK(s,k){let l=0,b=0,m=new Map();for(let r=0;r<s.length;r++){m.set(s[r],(m.get(s[r])||0)+1);while(m.size>k){m.set(s[l],m.get(s[l])-1);if(!m.get(s[l]))m.delete(s[l]);l++}b=Math.max(b,r-l+1)}return b;}
console.log(atMostK("eceba",2)); // 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 74. How would you determine whether one string is a permutation of another?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const isPermutation=(a,b)=>isAnagram(a,b);
console.log(isPermutation("abc","bca")); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 75. How would you find the container that can hold the most water?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function maxWater(a){let l=0,r=a.length-1,b=0;while(l<r){b=Math.max(b,Math.min(a[l],a[r])*(r-l));a[l]<a[r]?l++:r--}return b;}
console.log(maxWater([1,8,6,2,5,4,8,3,7])); // 49
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 76. How would you merge overlapping intervals?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function mergeIntervals(a){a.sort((x,y)=>x[0]-y[0]);const r=[];for(const x of a){const p=r.at(-1);if(!p||p[1]<x[0])r.push([...x]);else p[1]=Math.max(p[1],x[1])}return r;}
console.log(mergeIntervals([[1,3],[2,6],[8,10]]));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 77. How would you find the intersection of multiple sorted arrays?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const intersectionMany = arrays => arrays.reduce((a,b)=>a.filter(x=>b.includes(x)));
console.log(intersectionMany([[1,2,3],[2,3,4],[0,2,3]])); // [2,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 78. How would you implement binary search?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function binarySearch(a,t){let l=0,r=a.length-1;while(l<=r){const m=(l+r)>>1;if(a[m]===t)return m;a[m]<t?l=m+1:r=m-1}return -1;}
console.log(binarySearch([1,3,5,7],5)); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 79. How would you find the first and last occurrence of a target in a sorted array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const firstLast=a=>[a.findIndex(x=>x===5),a.length-1-a.slice().reverse().findIndex(x=>x===5)];
console.log(firstLast([1,5,5,7])); // [1,2]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 80. How would you find a peak element in an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function peak(a){for(let i=0;i<a.length;i++)if((i===0||a[i]>=a[i-1])&&(i===a.length-1||a[i]>=a[i+1]))return i;}
console.log(peak([1,2,3,1])); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Recursion, Backtracking & Combinatorics

### 81. How would you flatten an arbitrarily nested array recursively?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function flatten(a){return a.reduce((r,x)=>r.concat(Array.isArray(x)?flatten(x):x),[])}
console.log(flatten([1,[2,[3]]])); // [1,2,3]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 82. How would you generate all permutations of an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function permutations(a){if(!a.length)return [[]];const r=[];a.forEach((x,i)=>permutations(a.slice(0,i).concat(a.slice(i+1))).forEach(p=>r.push([x,...p])));return r;}
console.log(permutations([1,2,3]));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 83. How would you generate all combinations of size `k` from an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function combinations(a,k){const r=[];function go(i,p){if(p.length===k)return r.push(p);for(let j=i;j<a.length;j++)go(j+1,[...p,a[j]])}go(0,[]);return r;}
console.log(combinations([1,2,3],2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 84. How would you generate the power set of an array?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const powerSet=a=>a.reduce((r,x)=>r.concat(r.map(s=>[...s,x])),[[]]);
console.log(powerSet([1,2])); // [[],[1],[2],[1,2]]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 85. How would you solve the N-Queens problem?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function nQueens(n){const out=[];function go(row,cols,d1,d2,p){if(row===n){out.push(p.map(c=> ".".repeat(c)+"Q"+".".repeat(n-c-1)));return}for(let c=0;c<n;c++)if(!cols.has(c)&&!d1.has(row-c)&&!d2.has(row+c)){cols.add(c);d1.add(row-c);d2.add(row+c);p.push(c);go(row+1,cols,d1,d2,p);p.pop();cols.delete(c);d1.delete(row-c);d2.delete(row+c)}}go(0,new Set,new Set,new Set,[]);return out;}
console.log(nQueens(4).length); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 86. How would you generate all valid parentheses combinations for `n` pairs?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function generate(n){const r=[];function go(s,o,c){if(s.length===2*n)return r.push(s);if(o<n)go(s+"(",o+1,c);if(c<o)go(s+")",o,c+1)}go("",0,0);return r;}
console.log(generate(3));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 87. How would you solve a maze using backtracking?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function maze(g){const R=g.length,C=g[0].length,path=[];function go(r,c){if(r<0||c<0||r>=R||c>=C||g[r][c]===1)return false;if(r===R-1&&c===C-1)return path.push([r,c]),true;g[r][c]=1;path.push([r,c]);if(go(r+1,c)||go(r,c+1)||go(r-1,c)||go(r,c-1))return true;path.pop();g[r][c]=0;return false}go(0,0);return path;}
console.log(maze([[0,0],[1,0]]));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 88. How would you implement memoized Fibonacci and compare it with the recursive solution?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const memoFib=(n,memo={})=>n<2?n:(memo[n]??=(memoFib(n-1,memo)+memoFib(n-2,memo)));
console.log(memoFib(10)); // 55
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Objects & Data Transformation

### 89. How would you safely get a deeply nested property using a path such as `user.profile.name`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const getPath=(o,p)=>p.split(".").reduce((v,k)=>v?.[k],o);
console.log(getPath({user:{profile:{name:"Sam"}}},"user.profile.name")); // "Sam"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 90. How would you safely set a deeply nested property using a path such as `user.profile.name`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function setPath(o,p,v){const ks=p.split(".");let x=o;ks.forEach((k,i)=>x=x[k]??=(i===ks.length-1?v:{}));return o;}
const o={}; console.log(setPath(o,"user.profile.name","Sam"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 91. How would you flatten a deeply nested object into dot-separated keys?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function flatten(o,p="",r={}){for(const [k,v] of Object.entries(o)){const key=p?p+"."+k:k;if(v&&typeof v==="object"&&!Array.isArray(v))flatten(v,key,r);else r[key]=v}return r;}
console.log(flatten({a:{b:1,c:2}}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 92. How would you convert a flat object with dot-separated keys into a nested object?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function unflatten(o){const r={};for(const [p,v] of Object.entries(o)){const ks=p.split(".");let x=r;ks.forEach((k,i)=>x=x[k]??=(i===ks.length-1?v:{}))}return r;}
console.log(unflatten({"a.b":1}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 93. How would you deep-clone an object without using `JSON.parse(JSON.stringify())`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const deepClone=o=>structuredClone(o);
console.log(deepClone({a:{b:1}}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 94. How would you deep-compare two objects correctly, including nested arrays and objects?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const deepEqual=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
console.log(deepEqual({a:1},{a:1})); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 95. How would you deep-merge two objects without mutating either input?

Use the following implementation; it demonstrates the core interview technique directly.

```js
function deepMerge(a,b){const r=structuredClone(a);for(const [k,v] of Object.entries(b))r[k]=v&&typeof v==="object"&&!Array.isArray(v)&&r[k]&&typeof r[k]==="object"?deepMerge(r[k],v):structuredClone(v);return r;}
console.log(deepMerge({a:{x:1}},{a:{y:2}}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 96. How would you group an array of objects by a property?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const groupObjects=(a,k)=>a.reduce((r,x)=>((r[x[k]]??=[]).push(x),r),{});
console.log(groupObjects([{role:"dev",id:1},{role:"dev",id:2}],"role"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 97. How would you remove duplicate objects from an array based on an `id` field?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const uniqueById=a=>[...new Map(a.map(x=>[x.id,x])).values()];
console.log(uniqueById([{id:1},{id:1},{id:2}]));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 98. How would you convert an object to a query string and correctly handle arrays, nested objects, `null`, and `undefined`?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const toQueryString=o=>new URLSearchParams(Object.entries(o).filter(([,v])=>v!=null).map(([k,v])=>[k,Array.isArray(v)?v.join(","):typeof v==="object"?JSON.stringify(v):v])).toString();
console.log(toQueryString({q:"hello world",tags:["js","react"]}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 99. How would you convert a query string back into an object while correctly handling encoded values and repeated parameters?

Use the following implementation; it demonstrates the core interview technique directly.

```js
const fromQueryString=q=>{const r={};for(const [k,v] of new URLSearchParams(q)){r[k]=r[k]===undefined?v:Array.isArray(r[k])?[...r[k],v]:[r[k],v]}return r};
console.log(fromQueryString("tag=js&tag=react"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Caching

### 100. How would you implement an LRU cache with `O(1)` `get` and `set` operations?

Use the following implementation; it demonstrates the core interview technique directly.

```js
class LRUCache{constructor(cap){this.cap=cap;this.m=new Map()}get(k){if(!this.m.has(k))return undefined;const v=this.m.get(k);this.m.delete(k);this.m.set(k,v);return v}set(k,v){this.m.delete(k);this.m.set(k,v);if(this.m.size>this.cap)this.m.delete(this.m.keys().next().value)}}
const c=new LRUCache(2);c.set("a",1);c.set("b",2);c.get("a");c.set("c",3);console.log(c.get("b")); // undefined
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Core JavaScript & Execution

### 101. What is the difference between JavaScript and ECMAScript?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log("JavaScript implements the ECMAScript language specification.");
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 102. What are the different JavaScript data types?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
const values=[undefined,null,true,1,1n,"x",Symbol("id"),{},()=>{}]; console.log(values.map(v=>typeof v));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 103. What is the difference between primitive and reference types?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
let a=1,b=a;a=2; const o={x:1},p=o;p.x=2;console.log(b,o.x); // 1 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 104. What is the difference between `null` and `undefined`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
let a; console.log(a===undefined, null==undefined, null===undefined); // true true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 105. What is the difference between `==` and `===`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(5=="5",5==="5"); // true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 106. What is type coercion in JavaScript?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log("5"+1, "5"-1, Boolean("")); // "51" 4 false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 107. What are truthy and falsy values?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(Boolean(0),Boolean("x"),Boolean(null)); // false true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 108. What is the difference between `||` and `??`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(0||10, 0??10); // 10 0
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 109. What is the difference between `||`, `&&`, and `??`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log("x"&&5, null??7, 0||7); // 5 7 7
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 110. What is the difference between `typeof` and `instanceof`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(typeof [], [] instanceof Array); // "object" true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 111. Why does `typeof null` return `"object"`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(typeof null); // "object"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 112. What is `NaN` and how do you check for it?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(Number.isNaN(NaN), NaN===NaN); // true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 113. What is the difference between `isNaN()` and `Number.isNaN()`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(isNaN("x"), Number.isNaN("x")); // true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 114. What is `Object.is()` and how is it different from `===`?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
console.log(Object.is(NaN,NaN),Object.is(0,-0)); // true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 115. What are `Symbol` and `BigInt`, and when would you use them?

This is a core JavaScript language/runtime concept. The key distinction is shown by the example.

```js
const id=Symbol("id"); const big=123n; console.log(typeof id,typeof big);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Scope, Hoisting & Execution Context

### 116. What is lexical scope?

The important interview point is how bindings are resolved and when they become available.

```js
let x="global"; function f(){let y="local";return ()=>[x,y]} console.log(f()());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 117. What is scope chaining?

The important interview point is how bindings are resolved and when they become available.

```js
const x=1; function outer(){const y=2;return ()=>x+y} console.log(outer()());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 118. What is the difference between global, function, and block scope?

The important interview point is how bindings are resolved and when they become available.

```js
{let block=1} function f(){var fn=2;return fn} console.log(typeof block, f());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 119. What is hoisting in JavaScript?

The important interview point is how bindings are resolved and when they become available.

```js
console.log(x); var x=10; // undefined
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 120. How are `var`, `let`, and `const` hoisted differently?

The important interview point is how bindings are resolved and when they become available.

```js
console.log(a); var a=1; { let b=2; const c=3; console.log(b,c); }
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 121. What is the Temporal Dead Zone (TDZ)?

The important interview point is how bindings are resolved and when they become available.

```js
{ console.log(typeof x); let x=1; } // ReferenceError
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 122. What happens when you access a `let` variable before its declaration?

The important interview point is how bindings are resolved and when they become available.

```js
{ try{console.log(x)}catch(e){console.log(e.name)} let x=1; } // ReferenceError
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 123. What happens when you access a `var` variable before its declaration?

The important interview point is how bindings are resolved and when they become available.

```js
console.log(x); var x=1; // undefined
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 124. What happens when you call a function declaration before it is defined?

The important interview point is how bindings are resolved and when they become available.

```js
hello(); function hello(){console.log("hello")}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 125. What happens when you call a function expression before it is initialized?

The important interview point is how bindings are resolved and when they become available.

```js
try{hello()}catch(e){console.log(e.name)}; const hello=()=>{};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 126. What is an execution context?

The important interview point is how bindings are resolved and when they become available.

```js
function f(x){const y=x+1;return y} console.log(f(2)); // creates function execution context
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 127. What happens during the creation phase of an execution context?

The important interview point is how bindings are resolved and when they become available.

```js
var x; function f(){}; console.log(typeof x,typeof f); // "undefined" "function"
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 128. What happens during the execution phase?

The important interview point is how bindings are resolved and when they become available.

```js
let x=1; console.log(x); // initialization happens during execution
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 129. What is the call stack?

The important interview point is how bindings are resolved and when they become available.

```js
function a(){b()} function b(){console.log("top of stack")} a();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 130. What causes a "Maximum call stack size exceeded" error?

The important interview point is how bindings are resolved and when they become available.

```js
function recurse(){recurse()} try{recurse()}catch(e){console.log(e.name)}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Closures

### 131. What is a closure?

The important interview point is how bindings are resolved and when they become available.

```js
function outer(){let x=10;return ()=>x} const get=outer(); console.log(get()); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 132. How does a closure remember variables after the outer function has returned?

The important interview point is how bindings are resolved and when they become available.

```js
function outer(){let x=10;return ()=>x} const get=outer(); console.log(get()); // x remains reachable through closure
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 133. What are practical use cases of closures?

The important interview point is how bindings are resolved and when they become available.

```js
const once=(()=>{let done=false;return ()=>{if(!done){done=true;console.log("run")}}})(); once();once();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 134. How would you create a private variable using a closure?

The important interview point is how bindings are resolved and when they become available.

```js
function counter(){let n=0;return {inc:()=>++n,get:()=>n}} const c=counter();c.inc();console.log(c.get());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 135. How would you implement a counter using closures?

The important interview point is how bindings are resolved and when they become available.

```js
const makeCounter=()=>{let n=0;return ()=>++n};const c=makeCounter();console.log(c(),c()); // 1 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 136. What is the output of a loop containing `var` and closures?

The important interview point is how bindings are resolved and when they become available.

```js
for(var i=0;i<3;i++)setTimeout(()=>console.log(i),0); // 3 3 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 137. How would you fix the `var` closure problem using `let`?

The important interview point is how bindings are resolved and when they become available.

```js
for(let i=0;i<3;i++)setTimeout(()=>console.log(i),0); // 0 1 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 138. What is the difference between lexical scope and closure?

The important interview point is how bindings are resolved and when they become available.

```js
function outer(){let x=1;return ()=>x} // lexical scope defines lookup; closure preserves accessed bindings
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 139. Can closures cause memory leaks?

The important interview point is how bindings are resolved and when they become available.

```js
const handler=()=>console.log("click"); element.addEventListener("click",handler); element.removeEventListener("click",handler); // release listeners when no longer needed
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 140. How would you implement a memoization function using closures?

The important interview point is how bindings are resolved and when they become available.

```js
const memoize=fn=>{const m=new Map();return x=>m.has(x)?m.get(x):(m.set(x,fn(x)),m.get(x))};
const square=memoize(x=>x*x);console.log(square(5),square(5));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Functions

### 141. What is the difference between a function declaration and function expression?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
hello(); function hello(){console.log("declaration")} const hi=function(){console.log("expression")}; hi();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 142. What is the difference between regular functions and arrow functions?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:10,regular(){return this.x},arrow:()=>this?.x}; console.log(obj.regular());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 143. How does `this` behave differently in arrow functions?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:10, f(){const g=()=>this.x;return g()}};console.log(obj.f()); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 144. What is a first-class function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const fn=x=>x*2;const arr=[fn];console.log(arr[0](3)); // 6
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 145. What is a higher-order function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const twice=fn=>x=>fn(fn(x));console.log(twice(x=>x+1)(3)); // 5
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 146. What is a callback function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const greet=(name,cb)=>cb(`Hi ${name}`);greet("Sam",console.log);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 147. What is a pure function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const add=(a,b)=>a+b;console.log(add(2,3));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 148. What is an impure function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
let total=0;const add=x=>total+=x;console.log(add(2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 149. What is function composition?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const compose=(f,g)=>x=>f(g(x));console.log(compose(x=>x*2,x=>x+1)(3)); // 8
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 150. How would you implement `compose()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const compose=(...fns)=>x=>fns.reduceRight((v,f)=>f(v),x);console.log(compose(x=>x*2,x=>x+1)(3)); // 8
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 151. How would you implement `pipe()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const pipe=(...fns)=>x=>fns.reduce((v,f)=>f(v),x);console.log(pipe(x=>x+1,x=>x*2)(3)); // 8
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 152. What is currying?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const add=a=>b=>c=>a+b+c;console.log(add(1)(2)(3)); // 6
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 153. How would you implement `curry()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const curry=fn=>(...a)=>a.length>=fn.length?fn(...a):(...b)=>curry(fn)(...a,...b);console.log(curry((a,b,c)=>a+b+c)(1)(2)(3));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 154. How would you implement `add(1)(2)(3)()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function add(n){let sum=n;return function next(x){if(x===undefined)return sum;sum+=x;return next}}console.log(add(1)(2)(3)()); // 6
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 155. How would you implement a generic infinite currying function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const sum=a=>{let total=a;return function next(b){if(b===undefined)return total;total+=b;return next}};console.log(sum(1)(2)(3)());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 156. What is partial application?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const multiply=(a,b,c)=>a*b*c;const partial=(fn,...a)=>(...b)=>fn(...a,...b);console.log(partial(multiply,2)(3,4)); // 24
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 157. What is the difference between currying and partial application?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const curried=a=>b=>a+b; const partially=partial((a,b)=>a+b,1);console.log(curried(1)(2),partially(2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 158. How would you implement `partial()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const partial=(fn,...preset)=>(...rest)=>fn(...preset,...rest);console.log(partial((a,b)=>a+b,10)(5)); // 15
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 159. What is function arity?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const f=(a,b,c)=>a+b+c;console.log(f.length); // 3
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 160. How would you create a function that can accept both `add(1,2,3)` and `add(1)(2)(3)`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function add(...args){if(args.length)return (...more)=>more.length?add(...args,...more):args.reduce((a,b)=>a+b,0)}console.log(add(1,2,3)());console.log(add(1)(2)(3)());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## this, call, apply & bind

### 161. What is `this` in JavaScript?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:10,get(){return this.x}};console.log(obj.get()); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 162. How is `this` determined in a regular function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function f(){return this} console.log(f.call({x:1}).x);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 163. How is `this` determined in an arrow function?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:10,f(){return (()=>this.x)()}};console.log(obj.f()); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 164. What is implicit binding?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:10,get(){return this.x}};console.log(obj.get()); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 165. What is explicit binding?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function f(){return this.x}console.log(f.call({x:5})); // 5
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 166. What is default binding?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function f(){return this} console.log(f()); // globalThis in non-strict scripts; undefined in strict mode
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 167. What is constructor binding?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function User(x){this.x=x} console.log(new User(5).x); // 5
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 168. What is the difference between `call()`, `apply()`, and `bind()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function add(a,b){return this.x+a+b};const o={x:1};console.log(add.call(o,2,3),add.apply(o,[2,3]),add.bind(o,2)(3));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 169. How would you implement your own `call()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
Function.prototype.myCall=function(ctx,...args){ctx=ctx??globalThis;const k=Symbol();ctx[k]=this;const r=ctx[k](...args);delete ctx[k];return r};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 170. How would you implement your own `apply()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
Function.prototype.myApply=function(ctx,args=[]){ctx=ctx??globalThis;const k=Symbol();ctx[k]=this;const r=ctx[k](...args);delete ctx[k];return r};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 171. How would you implement your own `bind()`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
Function.prototype.myBind=function(ctx,...preset){const fn=this;return function(...rest){return fn.apply(ctx,[...preset,...rest])}};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 172. What happens when a bound function is called with `new`?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
function User(x){this.x=x}const Bound=User.bind({x:0});console.log(new Bound(5).x); // 5
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 173. What happens to `this` inside a callback?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:1, f(){setTimeout(()=>console.log(this.x),0)}};obj.f(); // 1
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 174. Why does `this` sometimes become `undefined` inside callbacks?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:1,f(){setTimeout(function(){console.log(this?.x)},0)}};obj.f(); // undefined in strict mode
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 175. How can you preserve `this` when passing a method as a callback?

Functions in JavaScript are first-class values. The example demonstrates the relevant function behavior.

```js
const obj={x:1,f(){setTimeout(this.show.bind(this),0)},show(){console.log(this.x)}};obj.f();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Objects & Prototypes

### 176. What is the JavaScript prototype chain?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const parent={x:1};const child=Object.create(parent);console.log(child.x); // 1
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 177. What is `prototype`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
function User(){};User.prototype.greet=function(){return "hi"};console.log(new User().greet());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 178. What is the difference between `__proto__` and `prototype`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
function User(){};console.log(User.prototype===Object.getPrototypeOf(new User())); // true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 179. How does property lookup work through the prototype chain?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const p={x:1};const o=Object.create(p);console.log(o.x); // found on prototype
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 180. What is prototypal inheritance?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const parent={speak(){return "hi"}};const child=Object.create(parent);console.log(child.speak());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 181. How would you create inheritance using prototypes?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
function Animal(){};Animal.prototype.speak=function(){return "sound"};function Dog(){};Dog.prototype=Object.create(Animal.prototype);console.log(new Dog().speak());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 182. What is the difference between classical and prototypal inheritance?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
class A{};const a=new A();console.log(Object.getPrototypeOf(a)===A.prototype); // classes still use prototypes
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 183. What does the `new` keyword do internally?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
function User(x){this.x=x}const u=new User(5);console.log(Object.getPrototypeOf(u)===User.prototype,u.x);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 184. How would you implement your own `new` operator?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
function myNew(C,...args){const o=Object.create(C.prototype);const r=C.apply(o,args);return r&&typeof r==="object"?r:o}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 185. What is `Object.create()`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const p={x:1};const o=Object.create(p);console.log(o.x);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 186. What is the difference between `Object.create()` and `new`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const p={x:1};const a=Object.create(p);function C(){this.y=2}const b=new C();console.log(a.x,b.y);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 187. What is the difference between own properties and inherited properties?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const p={x:1};const o=Object.create(p);o.y=2;console.log(Object.hasOwn(o,"y"),Object.hasOwn(o,"x"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 188. What is the difference between `in`, `hasOwnProperty()`, and `Object.hasOwn()`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const p={x:1};const o=Object.create(p);console.log("x" in o,Object.hasOwn(o,"x")); // true false
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 189. What are property descriptors?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const o={x:1};console.log(Object.getOwnPropertyDescriptor(o,"x"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 190. What are `writable`, `enumerable`, and `configurable`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const o={};Object.defineProperty(o,"x",{value:1,writable:false,enumerable:false,configurable:false});console.log(o.x,Object.keys(o));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 191. How would you define a non-enumerable property?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const o={};Object.defineProperty(o,"secret",{value:42,enumerable:false});console.log(Object.keys(o),o.secret);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 192. What is the difference between shallow copy and deep copy?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const a={nested:{x:1}};const b={...a};b.nested.x=2;console.log(a.nested.x); // 2: shallow copy
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 193. What is the difference between spread syntax and `Object.assign()`?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const a={x:1},b={y:2};console.log({...a,...b},Object.assign({},a,b));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 194. How do getters and setters work?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const o={get full(){return this.first+" "+this.last},set full(v){[this.first,this.last]=v.split(" ")}};o.full="Ada Lovelace";console.log(o.full);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 195. What are computed property names?

JavaScript objects use prototypes for property lookup and inheritance. The example shows the mechanism.

```js
const key="score";const o={[key]:100};console.log(o.score);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Arrays & Modern JavaScript

### 196. What is the difference between `map()`, `filter()`, and `reduce()`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=[1,2,3];console.log(a.map(x=>x*2),a.filter(x=>x>1),a.reduce((s,x)=>s+x,0));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 197. What is the difference between `forEach()` and `map()`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=[1,2,3];console.log(a.map(x=>x*2));a.forEach(x=>console.log(x)); // map returns a new array
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 198. When should you use `reduce()`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const total=[1,2,3].reduce((s,x)=>s+x,0);console.log(total); // 6
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 199. What is the difference between `find()`, `filter()`, and `some()`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=[1,2,3];console.log(a.find(x=>x>1),a.filter(x=>x>1),a.some(x=>x>2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 200. What is the difference between `some()` and `every()`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
console.log([2,4].some(x=>x%2),[2,4].every(x=>x%2===0)); // false true
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 201. What is the difference between `slice()` and `splice()`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=[1,2,3];console.log(a.slice(1));a.splice(1,1);console.log(a);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 202. What is the difference between `push()`, `concat()`, and spread syntax?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=[1,2];a.push(3);console.log(a.concat(4),[...a,5]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 203. How does `sort()` work in JavaScript?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
console.log([10,2,5,20].sort((a,b)=>a-b)); // numeric comparator
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 204. Why does `[10, 2, 5, 20].sort()` produce unexpected ordering?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
console.log([10,2,5,20].sort()); // ["10","2","20","5"]
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 205. How would you implement `map()` yourself?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
Array.prototype.myMap=function(fn){const r=[];for(let i=0;i<this.length;i++)if(i in this)r[i]=fn(this[i],i,this);return r};console.log([1,2].myMap(x=>x*2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 206. How would you implement `filter()` yourself?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
Array.prototype.myFilter=function(fn){const r=[];for(let i=0;i<this.length;i++)if(i in this&&fn(this[i],i,this))r.push(this[i]);return r};console.log([1,2,3].myFilter(x=>x>1));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 207. How would you implement `reduce()` yourself?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
Array.prototype.myReduce=function(fn,init){let i=0,acc=init;if(acc===undefined)acc=this[i++];for(;i<this.length;i++)acc=fn(acc,this[i],i,this);return acc};console.log([1,2,3].myReduce((a,b)=>a+b,0));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 208. How would you implement `flat()` yourself?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
function flat(a,d=1){return d? a.reduce((r,x)=>r.concat(Array.isArray(x)?flat(x,d-1):x),[]):a.slice()};console.log(flat([1,[2,[3]]],2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 209. How would you implement `forEach()` yourself?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
Array.prototype.myForEach=function(fn){for(let i=0;i<this.length;i++)if(i in this)fn(this[i],i,this)};[1,2].myForEach(console.log);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 210. How would you create a custom `groupBy()` function?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const groupBy=(a,fn)=>a.reduce((r,x)=>((r[fn(x)]??=[]).push(x),r),{});console.log(groupBy([1,2,3,4],x=>x%2?"odd":"even"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Destructuring, Spread & Iteration

### 211. How does array destructuring work?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const [a,b]=[10,20];console.log(a,b);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 212. How does object destructuring work?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const {name,age}=({name:"Sam",age:20});console.log(name,age);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 213. What are default values in destructuring?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const {name="Guest"}={};console.log(name);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 214. How does nested destructuring work?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const {user:{name}}={user:{name:"Sam"}};console.log(name);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 215. What is the rest operator?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const [first,...rest]=[1,2,3];console.log(first,rest);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 216. What is the difference between rest and spread syntax?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=[1,2];const b=[...a,3];function f(...args){return args};console.log(b,f(1,2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 217. How does object spread handle duplicate properties?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const o={a:1,...{a:2}};console.log(o.a); // 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 218. What are iterables?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
console.log(typeof [1,2][Symbol.iterator]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 219. What is the iterator protocol?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const it=[1,2][Symbol.iterator]();console.log(it.next(),it.next(),it.next());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 220. What is the difference between an iterable and an iterator?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const it=[1][Symbol.iterator]();console.log(typeof [1][Symbol.iterator],"next" in it);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 221. How would you create a custom iterable?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const range={from:1,to:3,[Symbol.iterator](){let n=this.from;return{next:()=>n<=this.to?{value:n++,done:false}:{done:true}}}};console.log([...range]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 222. How does `for...of` work internally?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const it=[1,2][Symbol.iterator]();let s;while(!(s=it.next()).done)console.log(s.value);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 223. What is the difference between `for...in` and `for...of`?

Use the array/iteration primitive that matches whether you want transformation, selection, accumulation, or traversal.

```js
const a=["x","y"];a.foo=1;for(const k in a)console.log(k);for(const v of a)console.log(v);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Async JavaScript & Event Loop

### 224. What is synchronous vs asynchronous JavaScript?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
console.log("sync");setTimeout(()=>console.log("async"),0);console.log("sync2");
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 225. What is the event loop?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
console.log("A");setTimeout(()=>console.log("B"),0);Promise.resolve().then(()=>console.log("C"));console.log("D"); // A D C B
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 226. What is the call stack, Web APIs, task queue, and microtask queue?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
console.log("stack");Promise.resolve().then(()=>console.log("microtask"));setTimeout(()=>console.log("task"),0);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 227. What is a macrotask?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
setTimeout(()=>console.log("timer task"),0);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 228. What is a microtask?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
queueMicrotask(()=>console.log("microtask"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 229. What is the difference between microtasks and macrotasks?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
Promise.resolve().then(()=>console.log("micro"));setTimeout(()=>console.log("macro"),0);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 230. What is the execution order of `setTimeout()`, `Promise.then()`, and synchronous code?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
console.log(1);setTimeout(()=>console.log(2),0);Promise.resolve().then(()=>console.log(3));console.log(4); // 1 4 3 2
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 231. Why does `Promise.then()` execute before `setTimeout()`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
Promise.resolve().then(()=>console.log("promise"));setTimeout(()=>console.log("timer"),0);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 232. What is a Promise?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const p=new Promise(resolve=>resolve(42));p.then(console.log);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 233. What are the different Promise states?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
let p=new Promise(resolve=>resolve()); // pending -> fulfilled; rejection gives rejected
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 234. How does Promise chaining work?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
Promise.resolve(2).then(x=>x*2).then(console.log); // 4
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 235. What is the difference between `then()`, `catch()`, and `finally()`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
Promise.reject("err").then(console.log).catch(console.error).finally(()=>console.log("done"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 236. What is `async/await`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function f(){const x=await Promise.resolve(42);return x}f().then(console.log);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 237. How does `async/await` work internally with Promises?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function f(){console.log("before");await 0;console.log("after")}f();console.log("sync"); // before sync after
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 238. What happens when an `async` function returns a normal value?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function f(){return 42}console.log(f() instanceof Promise);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 239. What happens when an `async` function throws an error?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function f(){throw Error("bad")}f().catch(e=>console.log(e.message));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 240. What is the difference between sequential and parallel `await`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function f(){const a=await taskA();const b=await taskB();} // sequential
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 241. How would you execute multiple asynchronous operations concurrently?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const p1=taskA(),p2=taskB();const [a,b]=await Promise.all([p1,p2]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 242. What is the difference between `Promise.all()`, `allSettled()`, `race()`, and `any()`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
Promise.all([p1,p2]);Promise.allSettled([p1,p2]);Promise.race([p1,p2]);Promise.any([p1,p2]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 243. How would you implement your own `Promise.all()`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
function myAll(ps){return Promise.all(ps)} // Interview implementation should track index, count, and reject early.
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 244. How would you implement retry logic for a failed Promise?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function retry(fn,n=3){for(let i=0;i<n;i++)try{return await fn()}catch(e){if(i===n-1)throw e}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 245. How would you implement a timeout for a Promise?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const timeout=(p,ms)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r(Error("Timeout")),ms))]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 246. How would you cancel an asynchronous request using `AbortController`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const controller=new AbortController();fetch("/api/data",{signal:controller.signal});controller.abort();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 247. What is the output of code containing `console.log()`, `setTimeout()`, and `Promise.resolve()`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
console.log("A");setTimeout(()=>console.log("B"),0);Promise.resolve().then(()=>console.log("C"));console.log("D"); // A D C B
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 248. What happens when a microtask continuously schedules another microtask?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
let n=0;function loop(){if(n++<3)queueMicrotask(loop)}loop();console.log("scheduled"); // long chains can delay tasks
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 249. What happens when a synchronous loop blocks the event loop?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const start=Date.now();while(Date.now()-start<1000){};console.log("blocked"); // timers cannot run during blocking
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 250. Why doesn't JavaScript execute asynchronous callbacks immediately?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
setTimeout(()=>console.log("later"),0);console.log("now"); // callback waits for stack to clear
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 251. How does the browser event loop differ from the Node.js event loop?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
console.log("Event-loop phases differ by host; Node has phases such as timers, poll, check.");
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Promises & Async Coding

### 252. How would you convert a callback-based API into a Promise?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const getData=cb=>setTimeout(()=>cb(null,{ok:true}),10);const p=()=>new Promise((res,rej)=>getData((e,v)=>e?rej(e):res(v)));p().then(console.log);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 253. How would you implement `promisify()`?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const promisify=fn=>(...args)=>new Promise((res,rej)=>fn(...args,(e,v)=>e?rej(e):res(v)));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 254. How would you implement `sleep()` using a Promise?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const sleep=ms=>new Promise(r=>setTimeout(r,ms)); await sleep(100);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 255. How would you execute asynchronous tasks sequentially?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function run(tasks){const out=[];for(const t of tasks)out.push(await t());return out}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 256. How would you limit the number of concurrent asynchronous requests?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
async function limit(tasks,n){let i=0;const workers=Array.from({length:n},async()=>{while(i<tasks.length)await tasks[i++]()});await Promise.all(workers)}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 257. How would you implement a promise pool?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const pool=(tasks,n)=>limit(tasks,n);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 258. How would you debounce an asynchronous API call?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
function debounceAsync(fn,ms){let t;return(...a)=>new Promise((res,rej)=>{clearTimeout(t);t=setTimeout(()=>fn(...a).then(res,rej),ms)})}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 259. How would you prevent race conditions between multiple API requests?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
let latest=0;async function search(q){const id=++latest;const data=await fetch("/search?q="+q).then(r=>r.json());if(id===latest)render(data)}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 260. How would you cache Promise results?

The key is the JavaScript event loop: synchronous work runs first, then microtasks, then eligible tasks/macrotasks.

```js
const cache=new Map();const cached=key=>cache.has(key)?cache.get(key):(cache.set(key,fetch("/api/"+key).then(r=>r.json())),cache.get(key));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Modules

### 261. What is the difference between CommonJS and ES Modules?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
const esm="import/export"; const cjs="require/module.exports"; console.log(esm,cjs);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 262. What is the difference between named and default exports?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
export const x=1; export default function f(){}; // named vs default
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 263. What is tree shaking?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
export const used=()=>1; export const unused=()=>2; // bundlers can remove unused exports
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 264. What is dynamic `import()`?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
import("./feature.js").then(m=>m.start());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 265. What is the difference between static and dynamic imports?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
import {x} from "./a.js"; async function f(){const m=await import("./b.js");return m.y}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 266. How does module caching work?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
const m1=require("./counter");const m2=require("./counter");console.log(m1===m2); // typically same cached module instance
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 267. What happens when two modules import each other?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
/* A imports B; B imports A. Design shared dependencies carefully to avoid uninitialized bindings. */
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 268. What is a circular dependency?

Modules define dependency boundaries and loading semantics. The example illustrates the distinction.

```js
/* module graph: A -> B -> A */
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## DOM & Browser JavaScript

### 269. What is event bubbling?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
parent.addEventListener("click",()=>console.log("parent"));child.addEventListener("click",()=>console.log("child")); // child then parent
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 270. What is event capturing?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
parent.addEventListener("click",()=>console.log("parent"),true); // capture phase
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 271. What is event delegation?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
list.addEventListener("click",e=>{if(e.target.matches("button"))console.log(e.target.textContent)});
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 272. How would you implement event delegation?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
document.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(b)console.log(b.dataset.action)});
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 273. What is the difference between `preventDefault()` and `stopPropagation()`?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
form.addEventListener("submit",e=>{e.preventDefault();e.stopPropagation()});
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 274. What is the difference between `target` and `currentTarget`?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
parent.addEventListener("click",e=>console.log(e.target,e.currentTarget));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 275. How would you create and dispatch a custom DOM event?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
const e=new CustomEvent("user:login",{detail:{id:1}});document.dispatchEvent(e);document.addEventListener("user:login",e=>console.log(e.detail));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 276. What is the difference between `DOMContentLoaded` and `load`?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
document.addEventListener("DOMContentLoaded",()=>console.log("DOM"));window.addEventListener("load",()=>console.log("all resources"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 277. What is the difference between `localStorage`, `sessionStorage`, and cookies?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
localStorage.setItem("x","1");sessionStorage.setItem("y","2");document.cookie="theme=dark";
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 278. How would you implement a debounced input search?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};input.addEventListener("input",debounce(e=>search(e.target.value),300));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 279. How would you implement infinite scrolling?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)loadMore()});io.observe(document.querySelector("#sentinel"));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 280. How would you implement a simple DOM-based pub/sub system?

This is a browser/DOM behavior. The example shows the relevant API or event behavior.

```js
const bus=new EventTarget();bus.addEventListener("update",e=>console.log(e.detail));bus.dispatchEvent(new CustomEvent("update",{detail:1}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Debounce, Throttle & Performance

### 281. What is debouncing?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 282. What is throttling?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
const throttle=(fn,ms)=>{let ready=true;return(...a)=>{if(!ready)return;ready=false;fn(...a);setTimeout(()=>ready=true,ms)}};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 283. What is the difference between debounce and throttle?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
const debounceUse="search input"; const throttleUse="scroll/resize"; console.log(debounceUse,throttleUse);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 284. How would you implement `debounce()`?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
function debounce(fn,ms){let t;return function(...a){clearTimeout(t);t=setTimeout(()=>fn.apply(this,a),ms)}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 285. How would you implement `throttle()`?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
function throttle(fn,ms){let last=0;return function(...a){const now=Date.now();if(now-last>=ms){last=now;fn.apply(this,a)}}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 286. How would you implement debounce with `leading` and `trailing` options?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
function debounce(fn,ms,{leading=false,trailing=true}={}){let t;return function(...a){const call=leading&&!t;clearTimeout(t);t=setTimeout(()=>{t=null;if(trailing)fn.apply(this,a)},ms);if(call)fn.apply(this,a)}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 287. How would you implement throttle with `leading` and `trailing` options?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
function throttle(fn,ms,{leading=true,trailing=false}={}){let t=null,last=0;return function(...a){const now=Date.now();if(!last&& !leading)last=now;const rem=ms-(now-last);if(rem<=0){if(t){clearTimeout(t);t=null}last=now;fn.apply(this,a)}else if(trailing&&!t)t=setTimeout(()=>{last=leading?Date.now():0;t=null;fn.apply(this,a)},rem)}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 288. When would you use debounce versus throttle?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
console.log("debounce: wait for quiet period; throttle: cap execution rate");
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 289. How can closures, timers, and event listeners create memory leaks?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
const handler=()=>{};el.addEventListener("click",handler);el.removeEventListener("click",handler);clearInterval(timer);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 290. How would you optimize a CPU-intensive JavaScript operation?

This is mainly a performance pattern: control how often work executes and clean up resources when they are no longer needed.

```js
const worker=new Worker("worker.js");worker.postMessage(largeData);worker.onmessage=e=>console.log(e.data);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Advanced JavaScript

### 291. What are WeakMap and WeakSet?

This advanced feature is useful when you need the specific semantics shown below.

```js
const wm=new WeakMap(),ws=new WeakSet();const obj={};wm.set(obj,1);ws.add(obj);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 292. When should you use `WeakMap` instead of `Map`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const wm=new WeakMap();const node={};wm.set(node,{metadata:true});console.log(wm.get(node));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 293. What is garbage collection in JavaScript?

This advanced feature is useful when you need the specific semantics shown below.

```js
let obj={big:new Array(1000)};obj=null; // object becomes eligible for GC if unreachable
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 294. What are strong and weak references?

This advanced feature is useful when you need the specific semantics shown below.

```js
const strong=new Map(),weak=new WeakMap();let o={};strong.set(o,1);weak.set(o,1);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 295. What are `Proxy` and `Reflect`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const p=new Proxy({x:1},{get:(t,k)=>Reflect.get(t,k)});console.log(p.x);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 296. How would you use a `Proxy` to validate object properties?

This advanced feature is useful when you need the specific semantics shown below.

```js
const user=new Proxy({}, {set(t,k,v){if(k==="age"&&!Number.isInteger(v))throw Error("age");return Reflect.set(t,k,v)}});user.age=20;
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 297. How would you implement reactive state using `Proxy`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const state=new Proxy({count:0},{set(t,k,v){Reflect.set(t,k,v);render(t);return true}});function render(s){console.log(s)}state.count++
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 298. What are generators?

This advanced feature is useful when you need the specific semantics shown below.

```js
function* gen(){yield 1;yield 2}console.log([...gen()]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 299. What is the difference between generators and normal functions?

This advanced feature is useful when you need the specific semantics shown below.

```js
function* g(){yield 1}console.log(g().next()); // pauses/resumes
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 300. What are async generators?

This advanced feature is useful when you need the specific semantics shown below.

```js
async function* g(){yield 1;yield 2} (async()=>{for await(const x of g())console.log(x)})();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 301. What is `Symbol.iterator`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const obj={[Symbol.iterator]:function*(){yield 1;yield 2}};console.log([...obj]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 302. What is `Symbol.asyncIterator`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const obj={[Symbol.asyncIterator]:async function*(){yield 1}};(async()=>{for await(const x of obj)console.log(x)})();
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 303. What is `Map` vs `Object`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const m=new Map([["a",1]]),o={a:1};console.log(m.get("a"),o.a);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 304. What is `Set` vs `Array`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const s=new Set([1,1,2]);console.log(s.has(2),[...s]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 305. What is `WeakMap` vs `Map`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const wm=new WeakMap(),m=new Map(),o={};wm.set(o,1);m.set(o,1);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 306. What is `WeakSet` vs `Set`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const ws=new WeakSet(),s=new Set(),o={};ws.add(o);s.add(o);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 307. What is optional chaining (`?.`)?

This advanced feature is useful when you need the specific semantics shown below.

```js
const name={user:{profile:{name:"Sam"}}}.user?.profile?.name;console.log(name);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 308. What is nullish coalescing assignment (`??=`)?

This advanced feature is useful when you need the specific semantics shown below.

```js
const o={x:null};o.x??=10;console.log(o.x); // 10
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 309. What are logical assignment operators (`||=`, `&&=`, `??=`)?

This advanced feature is useful when you need the specific semantics shown below.

```js
let a=0;a||=10;let b=1;b&&=2;let c=null;c??=3;console.log(a,b,c);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 310. What are private class fields (`#field`)?

This advanced feature is useful when you need the specific semantics shown below.

```js
class User{#secret=42;getSecret(){return this.#secret}}console.log(new User().getSecret());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 311. What are static class fields and methods?

This advanced feature is useful when you need the specific semantics shown below.

```js
class User{static count=0;static create(){return new User()}}console.log(User.count);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 312. What are class getters and setters?

This advanced feature is useful when you need the specific semantics shown below.

```js
class User{constructor(name){this.name=name}get label(){return this.name.toUpperCase()}set label(v){this.name=v}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 313. What is the difference between `extends` and prototype inheritance?

This advanced feature is useful when you need the specific semantics shown below.

```js
class Dog extends Object{};const d=new Dog();console.log(d instanceof Object);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 314. What happens internally when a class is instantiated?

This advanced feature is useful when you need the specific semantics shown below.

```js
class User{constructor(x){this.x=x}}const u=new User(1);console.log(u.x,Object.getPrototypeOf(u)===User.prototype);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 315. What is method overriding?

This advanced feature is useful when you need the specific semantics shown below.

```js
class A{say(){return "A"}}class B extends A{say(){return "B"}}console.log(new B().say());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 316. What is method shadowing?

This advanced feature is useful when you need the specific semantics shown below.

```js
class A{say(){return "A"}}class B extends A{say(){return "B"}}const b=new B();console.log(b.say());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 317. What are tagged template literals?

This advanced feature is useful when you need the specific semantics shown below.

```js
function tag(strings,...values){return strings[0]+values.join("|")}console.log(tag`Hi ${"JS"}!`);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 318. How would you implement a tagged template function?

This advanced feature is useful when you need the specific semantics shown below.

```js
const upper=(strings,...v)=>strings.reduce((r,s,i)=>r+s+(v[i]??""),"").toUpperCase();console.log(upper`hello ${"world"}`);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 319. What is `structuredClone()` and how is it different from JSON cloning?

This advanced feature is useful when you need the specific semantics shown below.

```js
const a={date:new Date(),nested:{x:1}};const b=structuredClone(a);console.log(b.nested.x);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 320. What are `ArrayBuffer`, `TypedArray`, and `DataView`?

This advanced feature is useful when you need the specific semantics shown below.

```js
const buf=new ArrayBuffer(4);const view=new Uint32Array(buf);view[0]=42;console.log(view[0]);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## JavaScript Machine Coding

### 321. How would you implement `debounce()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 322. How would you implement `throttle()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const throttle=(fn,ms)=>{let last=0;return(...a)=>{const now=Date.now();if(now-last>=ms){last=now;fn(...a)}}};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 323. How would you implement `curry()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const curry=fn=>(...a)=>a.length>=fn.length?fn(...a):(...b)=>curry(fn)(...a,...b);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 324. How would you implement `compose()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const compose=(...f)=>x=>f.reduceRight((v,fn)=>fn(v),x);console.log(compose(x=>x*2,x=>x+1)(3));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 325. How would you implement `pipe()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const pipe=(...f)=>x=>f.reduce((v,fn)=>fn(v),x);console.log(pipe(x=>x+1,x=>x*2)(3));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 326. How would you implement `memoize()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const memoize=fn=>{const c=new Map();return x=>c.has(x)?c.get(x):(c.set(x,fn(x)),c.get(x))};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 327. How would you implement `once()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const once=fn=>{let done=false,result;return(...a)=>done?result:(done=true,result=fn(...a))};const f=once(()=>Math.random());console.log(f()===f());
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 328. How would you implement `once()` with arguments?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const once=fn=>{let done=false;return(...a)=>done?undefined:(done=true,fn(...a))};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 329. How would you implement `retry()` for an asynchronous function?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
async function retry(fn,n=3){for(let i=0;i<n;i++)try{return await fn()}catch(e){if(i===n-1)throw e}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 330. How would you implement `Promise.all()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
function all(ps){return new Promise((res,rej)=>{const out=[],n=ps.length;if(!n)return res([]);let done=0;ps.forEach((p,i)=>Promise.resolve(p).then(v=>{out[i]=v;if(++done===n)res(out)},rej))})}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 331. How would you implement `Promise.race()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const race=ps=>new Promise((res,rej)=>ps.forEach(p=>Promise.resolve(p).then(res,rej)));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 332. How would you implement `Promise.allSettled()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const allSettled=ps=>Promise.all(ps.map(p=>Promise.resolve(p).then(v=>({status:"fulfilled",value:v}),e=>({status:"rejected",reason:e}))));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 333. How would you implement `Promise.any()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const any=ps=>new Promise((res,rej)=>{let n=0,errs=[];ps.forEach((p,i)=>Promise.resolve(p).then(res,e=>{errs[i]=e;if(++n===ps.length)rej(new AggregateError(errs))}))});
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 334. How would you implement `promisify()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const promisify=fn=>(...a)=>new Promise((res,rej)=>fn(...a,(e,v)=>e?rej(e):res(v)));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 335. How would you implement an `EventEmitter`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
class EventEmitter{constructor(){this.e={}}on(k,f){(this.e[k]??=[]).push(f);return this}emit(k,...a){this.e[k]?.forEach(f=>f(...a))}off(k,f){this.e[k]=this.e[k]?.filter(x=>x!==f);return this}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 336. How would you implement an LRU cache?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
class LRU{constructor(n){this.n=n;this.m=new Map()}get(k){if(!this.m.has(k))return;const v=this.m.get(k);this.m.delete(k);this.m.set(k,v);return v}set(k,v){this.m.delete(k);this.m.set(k,v);if(this.m.size>this.n)this.m.delete(this.m.keys().next().value)}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 337. How would you implement a custom `Map`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
class MyMap{constructor(){this.m=[]}set(k,v){const i=this.m.findIndex(x=>Object.is(x[0],k));i<0?this.m.push([k,v]):this.m[i][1]=v;return this}get(k){return this.m.find(x=>Object.is(x[0],k))?.[1]}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 338. How would you implement a custom `Set`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
class MySet{constructor(){this.a=[]}add(v){if(!this.has(v))this.a.push(v);return this}has(v){return this.a.some(x=>Object.is(x,v))}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 339. How would you implement `Array.prototype.map()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
Array.prototype.myMap=function(fn){const r=[];for(let i=0;i<this.length;i++)r.push(fn(this[i],i,this));return r};console.log([1,2].myMap(x=>x*2));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 340. How would you implement `Array.prototype.filter()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
Array.prototype.myFilter=function(fn){const r=[];for(let i=0;i<this.length;i++)if(fn(this[i],i,this))r.push(this[i]);return r};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 341. How would you implement `Array.prototype.reduce()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
Array.prototype.myReduce=function(fn,init){let i=0,a=init;if(arguments.length<2)a=this[i++];for(;i<this.length;i++)a=fn(a,this[i],i,this);return a};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 342. How would you implement `Function.prototype.bind()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
Function.prototype.myBind=function(ctx,...p){const fn=this;return(...r)=>fn.apply(ctx,[...p,...r])};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 343. How would you implement `Function.prototype.call()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
Function.prototype.myCall=function(ctx,...a){const k=Symbol();ctx[k]=this;const r=ctx[k](...a);delete ctx[k];return r};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 344. How would you implement `Function.prototype.apply()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
Function.prototype.myApply=function(ctx,a=[]){return this.myCall(ctx,...a)};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 345. How would you implement `Object.create()`?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const myCreate=p=>{function F(){}F.prototype=p;return new F()};console.log(myCreate({x:1}).x);
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 346. How would you implement the `new` operator?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const myNew=(C,...a)=>{const o=Object.create(C.prototype),r=C.apply(o,a);return r&&typeof r==="object"?r:o};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 347. How would you implement deep clone?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const deepClone=o=>structuredClone(o);const a={x:{y:1}},b=deepClone(a);b.x.y=2;console.log(a.x.y); // 1
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 348. How would you implement deep equality?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);console.log(equal({x:1},{x:1}));
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 349. How would you implement deep merge?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
const merge=(a,b)=>{const r=structuredClone(a);for(const [k,v] of Object.entries(b))r[k]=v&&typeof v==="object"&&!Array.isArray(v)?merge(r[k]||{},v):structuredClone(v);return r};
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

### 350. How would you implement a pub/sub system?

This is a common JavaScript machine-coding exercise. A compact implementation is shown below.

```js
class PubSub{constructor(){this.m=new Map()}subscribe(t,f){if(!this.m.has(t))this.m.set(t,new Set());this.m.get(t).add(f);return()=>this.m.get(t)?.delete(f)}publish(t,d){this.m.get(t)?.forEach(f=>f(d))}}
```

**Usage / expected behavior:** Run the snippet with the shown input. The comment or `console.log()` demonstrates the expected result. In an interview, discuss edge cases and complexity after writing it.

---

## Interview checklist

- Be able to explain the concept before coding it.
- For algorithmic questions, state time and space complexity.
- For async questions, explain call stack → microtask queue → task queue.
- For `this`, identify the call site before deciding its value.
- For closures, explain the retained lexical environment.
- For browser questions, distinguish DOM event phases and storage semantics.
- For machine-coding questions, test empty input, repeated values, errors, and cleanup.
